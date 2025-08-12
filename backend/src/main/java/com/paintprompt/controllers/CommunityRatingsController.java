package com.paintprompt.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserDataRepository;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@RestController
@RequestMapping("/api/community-ratings")
public class CommunityRatingsController {
    @Autowired
    private UserDataRepository userDataRepository;

    // S3 config from application.properties
    @Value("${aws.s3.bucket}")
    private String s3Bucket;

    @Value("${aws.s3.region}")
    private String s3Region;

    @Value("${aws.s3.urlPrefix}")
    private String s3UrlPrefix;

    @Value("${aws.accessKeyId}")
    private String awsAccessKey;

    @Value("${aws.secretKey}")
    private String awsSecretKey;

    // DTO for community image
    public static class CommunityImageDTO {
        public String imagePath;
        public String title;
        public String username;
        public String publishTs;
        public double avgRating;
        public int ratingCount;
    }

    // Helper: extract global image index from imagePath like "published-img7.png" or "img7.png"
    private int extractGlobalImageIndex(String path) {
        if (path == null) return -1;
        String checkPath = path.trim();
    if (checkPath.startsWith("published-")) checkPath = checkPath.substring("published-".length());
        if (checkPath.matches("img\\d+\\.png")) {
            try {
                return Integer.parseInt(checkPath.substring(3, checkPath.length() - 4));
            } catch (Exception ignored) {}
        }
        return -1;
    }

    // --- S3 Image Upload Endpoint ---
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username,
            @RequestHeader(value = "published", required = false, defaultValue = "false") boolean published,
            @RequestHeader(value = "title", required = false, defaultValue = "") String title
    ) {
        if (file.isEmpty() || username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("File and username are required");
        }
        // Find user
        UserData user = userDataRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        // Build S3 key with sequential numbering (img1.png, img2.png, ...)
        String prefix = published ? "published-" : "";
        int maxImgNum = 0;
        // Check all users' image_paths for the highest imgN.png number
        List<UserData> allUsersForImgNum = userDataRepository.findAll();
        for (UserData u : allUsersForImgNum) {
            String[] paths = u.getImage_paths() != null ? u.getImage_paths().split(",") : new String[0];
            for (String path : paths) {
                path = path.trim();
                // Remove published- prefix if present
                String checkPath = path.startsWith("published-") ? path.substring("published-".length()) : path;
                if (checkPath.matches("img\\d+\\.png")) {
                    try {
                        int n = Integer.parseInt(checkPath.substring(3, checkPath.length() - 4));
                        if (n > maxImgNum) maxImgNum = n;
                    } catch (Exception ignore) {}
                }
            }
        }
        int nextImgNum = maxImgNum + 1;
        String imgName = "img" + nextImgNum + ".png";
        String key = prefix + imgName;
        // Upload to S3
        try {
            S3Client s3 = S3Client.builder()
                    .region(Region.of(s3Region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(awsAccessKey, awsSecretKey)
                    ))
                    .build();
            s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(s3Bucket)
                            .key(key)
                            .contentType(file.getContentType())
                            // Disable client-side caching entirely
                            .cacheControl("no-cache, no-store, must-revalidate")
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );
        } catch (S3Exception | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("S3 upload failed: " + e.getMessage());
        }
        // Update user image_paths, titles, upload_ts, publish_ts
        String newPath = key;
        String currentPaths = user.getImage_paths();
        String newTitle = title != null ? title : "";
        String currentTitles = user.getTitles();
        String nowIso = java.time.Instant.now().toString();
        String currentUploadTs = user.getUpload_ts();
        String currentPublishTs = user.getPublish_ts();
        // Append new values to comma-separated strings
        if (currentPaths == null || currentPaths.isEmpty()) {
            user.setImage_paths(newPath);
            user.setTitles(newTitle);
            user.setUpload_ts(nowIso);
            user.setPublish_ts(published ? nowIso : "");
        } else {
            user.setImage_paths(currentPaths + "," + newPath);
            user.setTitles((currentTitles != null && !currentTitles.isEmpty()) ? currentTitles + "," + newTitle : newTitle);
            user.setUpload_ts((currentUploadTs != null && !currentUploadTs.isEmpty()) ? currentUploadTs + "," + nowIso : nowIso);
            user.setPublish_ts((currentPublishTs != null && !currentPublishTs.isEmpty()) ? currentPublishTs + "," + (published ? nowIso : "") : (published ? nowIso : ""));
        }
        userDataRepository.save(user);
        // Return S3 URL
        String url = s3UrlPrefix + key;
        return ResponseEntity.ok(url);
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
            for (int i = 0; i < paths.length; i++) {
                String path = paths[i].trim();
                if (!path.startsWith("published-")) continue;
                CommunityImageDTO dto = new CommunityImageDTO();
                dto.imagePath = path;
                dto.title = i < titles.length ? titles[i].trim() : "";
                dto.username = user.getUsername();
                dto.publishTs = i < publishTs.length ? publishTs[i].trim() : "";

                // Compute average rating and count across all users' community_ratings for this image index (imgN -> index N-1)
                int index = extractGlobalImageIndex(path); // 1-based index from imgN
                if (index > 0) {
                    int pos = index - 1;
                    int sum = 0;
                    int count = 0;
                    for (UserData rater : allUsers) {
                        String csv = rater.getCommunity_ratings();
                        if (csv == null || csv.isEmpty()) continue;
                        String[] arr = csv.split(",");
                        if (pos < arr.length) {
                            String val = arr[pos] != null ? arr[pos].trim() : "";
                            if (!val.isEmpty() && !val.equalsIgnoreCase("null")) {
                                try {
                                    int v = Integer.parseInt(val);
                                    if (v >= 1 && v <= 5) {
                                        sum += v;
                                        count++;
                                    }
                                } catch (NumberFormatException ignore) {}
                            }
                        }
                    }
                    dto.ratingCount = count;
                    dto.avgRating = count > 0 ? (double) sum / count : 0.0;
                } else {
                    dto.ratingCount = 0;
                    dto.avgRating = 0.0;
                }
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
    public ResponseEntity<?> submitRating(@RequestBody SubmitRatingRequest req, @RequestParam String currentUser) {
        if (req.rating < 1 || req.rating > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }
        if (req.targetUsername.equals(currentUser)) {
            return ResponseEntity.badRequest().body("You cannot rate your own artwork");
        }
        UserData targetUser = userDataRepository.findByUsername(req.targetUsername);
        if (targetUser == null) {
            return ResponseEntity.status(404).body("Target user not found");
        }
        // Determine global image index for the given imagePath
        int index = extractGlobalImageIndex(req.imagePath);
        if (index <= 0) {
            return ResponseEntity.status(404).body("Invalid image path");
        }
        // Verify that the target user has this image published
        String[] paths = targetUser.getImage_paths() != null ? targetUser.getImage_paths().split(",") : new String[0];
        boolean imageExists = Arrays.stream(paths).anyMatch(p -> {
            String pp = p == null ? "" : p.trim();
            return pp.equals(req.imagePath);
        });
        if (!imageExists) {
            return ResponseEntity.status(404).body("Image not found for user");
        }

        // Store rating in rater's community_ratings CSV at position index-1
        UserData rater = userDataRepository.findByUsername(currentUser);
        if (rater == null) {
            return ResponseEntity.status(404).body("Rater user not found");
        }
        int pos = index - 1;
        String csv = rater.getCommunity_ratings();
        String[] arr = (csv == null || csv.isEmpty()) ? new String[pos + 1] : csv.split(",");
        if (arr.length <= pos) {
            arr = Arrays.copyOf(arr, pos + 1);
        }
        arr[pos] = String.valueOf(req.rating);
        rater.setCommunity_ratings(String.join(",", Arrays.stream(arr).map(s -> s == null ? "" : s).toArray(String[]::new)));
        userDataRepository.save(rater);

        // Recompute avg and count across all users for this image index to return immediately
        List<UserData> allUsers = userDataRepository.findAll();
        int sum = 0;
        int count = 0;
        for (UserData u : allUsers) {
            String c = u.getCommunity_ratings();
            if (c == null || c.isEmpty()) continue;
            String[] a = c.split(",");
            if (pos < a.length) {
                String v = a[pos] != null ? a[pos].trim() : "";
                if (!v.isEmpty() && !v.equalsIgnoreCase("null")) {
                    try {
                        int iv = Integer.parseInt(v);
                        if (iv >= 1 && iv <= 5) {
                            sum += iv;
                            count++;
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("avgRating", count > 0 ? (double) sum / count : 0.0);
        resp.put("ratingCount", count);
        return ResponseEntity.ok(resp);
    }
}
