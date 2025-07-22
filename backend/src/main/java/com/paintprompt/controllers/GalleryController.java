package com.paintprompt.controllers;

import com.paintprompt.models.GalleryItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/gallery")
@CrossOrigin(origins = "http://localhost:5173") // or :3000 depending on frontend port
public class GalleryController {

    private final List<GalleryItem> gallery = new ArrayList<>();
private static final String UPLOAD_DIR = "uploads/";


    @GetMapping
    public List<GalleryItem> getGallery() {
        return gallery;
    }

    @PostMapping
    public void addArtwork(@RequestBody GalleryItem item) {
        gallery.add(item);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> handleImageUpload(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }

        try {
            // Create uploads folder if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Save the file
            // Save the file
Path filepath = Paths.get(UPLOAD_DIR, file.getOriginalFilename());
System.out.println("Saving image to: " + filepath.toAbsolutePath()); // ✅ Add this
Files.write(filepath, file.getBytes());

         


            // Add to gallery list (for demo purposes only)
            GalleryItem newItem = new GalleryItem();
            newItem.setTitle(title);
            newItem.setDate(java.time.LocalDate.now().toString());
            newItem.setImage("/uploads/" + file.getOriginalFilename());
            gallery.add(newItem);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload: " + e.getMessage());
        }
    }
}
