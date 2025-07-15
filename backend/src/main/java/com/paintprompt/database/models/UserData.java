package com.paintprompt.database.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_data")
public class UserData {
    @Id
    private String username;
    private String materials;
    private String communityRatings; // Store as plain text, parse in controller

    // Getters and setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getMaterials() {
        return materials;
    }
    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public String getCommunityRatings() {
        return communityRatings;
    }
    public void setCommunityRatings(String communityRatings) {
        this.communityRatings = communityRatings;
    }
}
