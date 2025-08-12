package com.paintprompt.controllers;

import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.time.Instant;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@RestController
public class GalleryController {
    @Autowired
    private UserDataRepository userDataRepository;

    @Value("${aws.s3.urlPrefix}")
    private String s3UrlPrefix;

    @Value("${aws.s3.bucket}")
    private String s3Bucket;

    @Value("${aws.s3.region}")
    private String s3Region;

    @Value("${aws.accessKeyId}")
    private String awsAccessKey;

    @Value("${aws.secretKey}")
    private String awsSecretKey;

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

    // Returns current user's images, titles, and upload timestamps from DB with S3 URLs
    @GetMapping("/api/gallery/user-images")
    public ResponseEntity<List<Map<String, Object>>> getUserImages(@RequestParam String currentUser) {
        UserData user = userDataRepository.findByUsername(currentUser);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        String[] paths = user.getImage_paths() != null ? user.getImage_paths().split(",") : new String[0];
        String[] titles = user.getTitles() != null ? user.getTitles().split(",") : new String[0];
        String[] uploadTs = user.getUpload_ts() != null ? user.getUpload_ts().split(",") : new String[0];
        List<UserData> allUsers = userDataRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < paths.length; i++) {
            Map<String, Object> item = new HashMap<>();
            String path = paths[i].trim();
            item.put("image", s3UrlPrefix + path);
            item.put("title", i < titles.length ? titles[i].trim() : "");
            item.put("upload_ts", i < uploadTs.length ? uploadTs[i].trim() : "");
            item.put("imagePath", path);
            boolean published = path.startsWith("published-");
            item.put("published", published);
            if (published) {
                int index = extractGlobalImageIndex(path);
                int pos = index > 0 ? index - 1 : -1;
                int sum = 0;
                int count = 0;
                if (pos >= 0) {
                    for (UserData rater : allUsers) {
                        String csv = rater.getCommunity_ratings();
                        if (csv == null || csv.isEmpty()) continue;
                        String[] arr = csv.split(",");
                        if (pos < arr.length) {
                            String val = arr[pos] != null ? arr[pos].trim() : "";
                            if (!val.isEmpty() && !val.equalsIgnoreCase("null")) {
                                try {
                                    int v = Integer.parseInt(val);
                                    if (v >= 1 && v <= 5) { sum += v; count++; }
                                } catch (NumberFormatException ignored) {}
                            }
                        }
                    }
                }
                item.put("avgRating", count > 0 ? (double) sum / count : 0.0);
                item.put("ratingCount", count);
            }
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }

    public static class ModifyImageRequest {
        public String imagePath;
    }

    @PostMapping("/api/gallery/publish")
    public ResponseEntity<?> publishImage(@RequestParam String currentUser, @RequestBody ModifyImageRequest req) {
        if (req.imagePath == null || req.imagePath.isBlank()) {
            return ResponseEntity.badRequest().body("imagePath is required");
        }
        if (req.imagePath.startsWith("published-")) {
            return ResponseEntity.badRequest().body("Image is already published");
        }
        UserData user = userDataRepository.findByUsername(currentUser);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        String[] paths = user.getImage_paths() != null ? user.getImage_paths().split(",") : new String[0];
        String[] titles = user.getTitles() != null ? user.getTitles().split(",") : new String[0];
        String[] uploadTs = user.getUpload_ts() != null ? user.getUpload_ts().split(",") : new String[0];
        String[] publishTs = user.getPublish_ts() != null ? user.getPublish_ts().split(",") : new String[0];
        int idx = -1;
        for (int i = 0; i < paths.length; i++) {
            if (req.imagePath.equals(paths[i].trim())) { idx = i; break; }
        }
        if (idx < 0) return ResponseEntity.status(404).body("Image not found");

        String oldKey = paths[idx].trim();
        String newKey = "published-" + oldKey;

        try {
            S3Client s3 = S3Client.builder()
                    .region(Region.of(s3Region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(awsAccessKey, awsSecretKey)
                    ))
                    .build();
            s3.copyObject(CopyObjectRequest.builder()
                    .sourceBucket(s3Bucket)
                    .sourceKey(oldKey)
                    .destinationBucket(s3Bucket)
                    .destinationKey(newKey)
                    .build());
            // Optionally delete the old object to keep bucket clean
            s3.deleteObject(DeleteObjectRequest.builder().bucket(s3Bucket).key(oldKey).build());
        } catch (S3Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("S3 publish failed: " + e.getMessage());
        }

        // Update DB row values at this index
        paths[idx] = newKey;
        // ensure publishTs has length
        if (publishTs.length < paths.length) {
            publishTs = java.util.Arrays.copyOf(publishTs, paths.length);
        }
        publishTs[idx] = Instant.now().toString();

        user.setImage_paths(String.join(",", paths));
        user.setTitles(String.join(",", titles));
        user.setUpload_ts(String.join(",", uploadTs));
        user.setPublish_ts(String.join(",", publishTs));
        userDataRepository.save(user);
        return ResponseEntity.ok(Map.of("imagePath", newKey, "published", true));
    }

    @PostMapping("/api/gallery/delete")
    public ResponseEntity<?> deleteImage(@RequestParam String currentUser, @RequestBody ModifyImageRequest req) {
        if (req.imagePath == null || req.imagePath.isBlank()) {
            return ResponseEntity.badRequest().body("imagePath is required");
        }
        UserData user = userDataRepository.findByUsername(currentUser);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        String[] paths = user.getImage_paths() != null ? user.getImage_paths().split(",") : new String[0];
        String[] titles = user.getTitles() != null ? user.getTitles().split(",") : new String[0];
        String[] uploadTs = user.getUpload_ts() != null ? user.getUpload_ts().split(",") : new String[0];
        String[] publishTs = user.getPublish_ts() != null ? user.getPublish_ts().split(",") : new String[0];
        String[] ratings = user.getRatings() != null ? user.getRatings().split(",") : new String[0];

        int idx = -1;
        for (int i = 0; i < paths.length; i++) {
            if (req.imagePath.equals(paths[i].trim())) { idx = i; break; }
        }
        if (idx < 0) return ResponseEntity.status(404).body("Image not found");

        String keyToDelete = paths[idx].trim();
        // Remove index i from each CSV array
        java.util.function.BiFunction<String[], Integer, String> removeAt = (arr, removeIndex) -> {
            if (arr == null) return "";
            List<String> out = new ArrayList<>();
            for (int j = 0; j < arr.length; j++) if (j != removeIndex) out.add(arr[j]);
            return String.join(",", out);
        };
        user.setImage_paths(removeAt.apply(paths, idx));
        user.setTitles(removeAt.apply(titles, idx));
        user.setUpload_ts(removeAt.apply(uploadTs, idx));
        user.setPublish_ts(removeAt.apply(publishTs, idx));
        user.setRatings(removeAt.apply(ratings, idx));
        userDataRepository.save(user);

        // Attempt to delete S3 object
        try {
            S3Client s3 = S3Client.builder()
                    .region(Region.of(s3Region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(awsAccessKey, awsSecretKey)
                    ))
                    .build();
            s3.deleteObject(DeleteObjectRequest.builder().bucket(s3Bucket).key(keyToDelete).build());
        } catch (S3Exception ignored) {}

        return ResponseEntity.ok(Map.of("deleted", true));
    }
}