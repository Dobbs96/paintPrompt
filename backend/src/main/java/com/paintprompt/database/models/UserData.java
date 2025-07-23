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
    private String image_paths;
    private String titles;
    private String upload_ts;
    private String publish_ts;
    private String ratings;

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

    public String getImage_paths() {
        return image_paths;
    }
    public void setImage_paths(String image_paths) {
        this.image_paths = image_paths;
    }

    public String getTitles() {
        return titles;
    }
    public void setTitles(String titles) {
        this.titles = titles;
    }

    public String getUpload_ts() {
        return upload_ts;
    }
    public void setUpload_ts(String upload_ts) {
        this.upload_ts = upload_ts;
    }

    public String getPublish_ts() {
        return publish_ts;
    }
    public void setPublish_ts(String publish_ts) {
        this.publish_ts = publish_ts;
    }

    public String getRatings() {
        return ratings;
    }
    public void setRatings(String ratings) {
        this.ratings = ratings;
    }
}
