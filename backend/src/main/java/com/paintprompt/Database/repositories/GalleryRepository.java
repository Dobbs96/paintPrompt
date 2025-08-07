package com.paintprompt.database.repositories;

import com.paintprompt.database.models.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findByUsername(String username);
}
