package com.paintprompt.controllers;

import com.paintprompt.database.models.UserData;
import com.paintprompt.database.repositories.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/gallery")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://paint-prompt.vercel.app",
    "https://paint-prompt-q0p2k3a0l-friendy-starter.vercel.app"
})

public class GalleryController {
    @Autowired
    private UserDataRepository userDataRepository;

    @Value("${aws.s3.urlPrefix}")
    private String s3UrlPrefix;

    // Returns current user's images, titles, and upload timestamps from DB with S3 URLs
    @GetMapping("/api/gallery/user-images")
    public ResponseEntity<List<Map<String, String>>> getUserImages(@RequestParam String currentUser) {
        UserData user = userDataRepository.findByUsername(currentUser);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        String[] paths = user.getImage_paths() != null ? user.getImage_paths().split(",") : new String[0];
        String[] titles = user.getTitles() != null ? user.getTitles().split(",") : new String[0];
        String[] uploadTs = user.getUpload_ts() != null ? user.getUpload_ts().split(",") : new String[0];
        List<Map<String, String>> result = new ArrayList<>();
        for (int i = 0; i < paths.length; i++) {
            Map<String, String> item = new HashMap<>();
            String path = paths[i].trim();
            item.put("image", s3UrlPrefix + path);
            item.put("title", i < titles.length ? titles[i].trim() : "");
            item.put("upload_ts", i < uploadTs.length ? uploadTs[i].trim() : "");
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }
}