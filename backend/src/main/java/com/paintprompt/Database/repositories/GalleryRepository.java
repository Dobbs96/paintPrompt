package com.paintprompt.database.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paintprompt.database.models.GalleryItem;

public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findByUsername(String username);
}
