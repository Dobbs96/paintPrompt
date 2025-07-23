package com.paintprompt.controllers;

import com.paintprompt.database.models.GalleryItem;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/gallery")
@CrossOrigin(origins = "http://localhost:3000")
public class GalleryController {

    private final List<GalleryItem> gallery = new ArrayList<>();

    @GetMapping
    public List<GalleryItem> getGallery() {
        return gallery;
    }

    @PostMapping
    public void addArtwork(@RequestBody GalleryItem item) {
        gallery.add(item);
    }
}
