package com.rewrap.model;

import java.util.List;

public class Item {
    private String id;
    private String title;
    private String category;
    private double pricePerDay;
    private double rating;
    private int reviewCount;
    private double distanceKm;
    private String location;
    private String imageUrl;
    private boolean isAvailable;
    private String description;
    private List<String> features;
    private User owner;
    private double carbonSavingsKg;
    private double materialSavingsKg;

    public Item() {}

    public Item(String id, String title, String category, double pricePerDay, double rating,
                int reviewCount, double distanceKm, String location, String imageUrl,
                boolean isAvailable, String description, List<String> features, User owner,
                double carbonSavingsKg, double materialSavingsKg) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.pricePerDay = pricePerDay;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.distanceKm = distanceKm;
        this.location = location;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
        this.description = description;
        this.features = features;
        this.owner = owner;
        this.carbonSavingsKg = carbonSavingsKg;
        this.materialSavingsKg = materialSavingsKg;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(double pricePerDay) { this.pricePerDay = pricePerDay; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public double getCarbonSavingsKg() { return carbonSavingsKg; }
    public void setCarbonSavingsKg(double carbonSavingsKg) { this.carbonSavingsKg = carbonSavingsKg; }

    public double getMaterialSavingsKg() { return materialSavingsKg; }
    public void setMaterialSavingsKg(double materialSavingsKg) { this.materialSavingsKg = materialSavingsKg; }
}
