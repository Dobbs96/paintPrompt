package com.paintprompt.models;

public class GalleryItem {
    private String title;
    private String date;
    private String image;

    public GalleryItem() {}

    public GalleryItem(String title, String date, String image) {
        this.title = title;
        this.date = date;
        this.image = image;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
