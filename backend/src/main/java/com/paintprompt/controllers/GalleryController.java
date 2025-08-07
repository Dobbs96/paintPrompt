package com.paintprompt.controllers;

import com.paintprompt.database.models.GalleryItem;
import com.paintprompt.database.repositories.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/gallery")
@CrossOrigin(origins = "http://localhost:5173") // adjust as needed
public class GalleryController {

    @Autowired
    private GalleryRepository galleryRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<GalleryItem> getGallery(@RequestParam String username) {
        return galleryRepository.findByUsername(username);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> handleImageUpload(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username
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
            Path filepath = Paths.get(UPLOAD_DIR, file.getOriginalFilename());
            System.out.println("Saving image to: " + filepath.toAbsolutePath());
            Files.write(filepath, file.getBytes());

            // Create new gallery item and save to DB
            GalleryItem newItem = new GalleryItem();
            newItem.setTitle(title);
            newItem.setDate(java.time.LocalDate.now().toString());
            newItem.setImage(file.getOriginalFilename()); // just the filename
            newItem.setUsername(username);
            galleryRepository.save(newItem);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload: " + e.getMessage());
        }
    }
}
