package com.paintprompt.controllers;

import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community-ratings")
public class CommunityRatingsController {
    @Autowired
    private UserDataRepository userDataRepository;

    // DTO for community image
    public static class CommunityImageDTO {
        public String imagePath;
        public String title;
        public String username;
        public String publishTs;
        public double avgRating;
        public int ratingCount;
    }

    @GetMapping("/images")
    public ResponseEntity<Map<String, Object>> getCommunityImages(
            @RequestParam String currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<UserData> allUsers = userDataRepository.findAll();
        List<CommunityImageDTO> images = new ArrayList<>();

        for (UserData user : allUsers) {
            if (user.getUsername().equals(currentUser)) continue;
            String[] paths = user.getImage_paths() != null ? user.getImage_paths().split(",") : new String[0];
            String[] titles = user.getTitles() != null ? user.getTitles().split(",") : new String[0];
            String[] publishTs = user.getPublish_ts() != null ? user.getPublish_ts().split(",") : new String[0];
            String[] ratingsArr = user.getRatings() != null ? user.getRatings().split(",") : new String[0];

            for (int i = 0; i < paths.length; i++) {
                String path = paths[i].trim();
                if (!path.startsWith("published-")) continue;
                CommunityImageDTO dto = new CommunityImageDTO();
                dto.imagePath = path;
                dto.title = i < titles.length ? titles[i].trim() : "";
                dto.username = user.getUsername();
                dto.publishTs = i < publishTs.length ? publishTs[i].trim() : "";
                // Ratings: can be improved to support multiple ratings per image
                try {
                    dto.avgRating = i < ratingsArr.length ? Double.parseDouble(ratingsArr[i].trim()) : 0;
                } catch (Exception e) {
                    dto.avgRating = 0;
                }
                dto.ratingCount = dto.avgRating > 0 ? 1 : 0;
                images.add(dto);
            }
        }
        // Sort by publishTs descending
        images.sort((a, b) -> b.publishTs.compareTo(a.publishTs));
        int from = page * size;
        int to = Math.min(from + size, images.size());
        List<CommunityImageDTO> pageList = from < to ? images.subList(from, to) : new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        result.put("images", pageList);
        result.put("total", images.size());
        return ResponseEntity.ok(result);
    }

    // DTO for submitting a rating
    public static class SubmitRatingRequest {
        public String targetUsername;
        public String imagePath;
        public int rating; // 1-5
    }

    @PostMapping("/rate")
    public ResponseEntity<String> submitRating(@RequestBody SubmitRatingRequest req, @RequestParam String currentUser) {
        if (req.rating < 1 || req.rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }
        if (req.targetUsername.equals(currentUser)) {
            return ResponseEntity.badRequest().body("You cannot rate your own artwork");
        }
        UserData user = userDataRepository.findByUsername(req.targetUsername);
        if (user == null) {
            return ResponseEntity.status(404).body("Target user not found");
        }
        String[] paths = user.getImage_paths() != null ? user.getImage_paths().split(",") : new String[0];
        String[] ratingsArr = user.getRatings() != null ? user.getRatings().split(",") : new String[paths.length];
        // Ensure ratingsArr is same length as paths
        if (ratingsArr.length < paths.length) {
            ratingsArr = Arrays.copyOf(ratingsArr, paths.length);
        }
        boolean found = false;
        for (int i = 0; i < paths.length; i++) {
            if (paths[i].trim().equals(req.imagePath)) {
                // For simplicity, just overwrite the rating (can be extended to support multiple ratings per image)
                ratingsArr[i] = String.valueOf(req.rating);
                found = true;
                break;
            }
        }
        if (!found) {
            return ResponseEntity.status(404).body("Image not found for user");
        }
        user.setRatings(String.join(",", ratingsArr));
        userDataRepository.save(user);
        return ResponseEntity.ok("Rating submitted");
    }
}
