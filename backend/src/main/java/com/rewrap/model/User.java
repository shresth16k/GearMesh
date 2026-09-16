package com.rewrap.model;

public class User {
    private String id;
    private String name;
    private String location;
    private String avatar;
    private double rating;
    private int reviewsCount;
    private boolean isVerified;
    private int itemsBorrowed;
    private int itemsLent;
    private double impactSavedAmount;
    private double impactKgKept;

    public User() {}

    public User(String id, String name, String location, String avatar, double rating, int reviewsCount,
                boolean isVerified, int itemsBorrowed, int itemsLent, double impactSavedAmount, double impactKgKept) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.avatar = avatar;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.isVerified = isVerified;
        this.itemsBorrowed = itemsBorrowed;
        this.itemsLent = itemsLent;
        this.impactSavedAmount = impactSavedAmount;
        this.impactKgKept = impactKgKept;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(int reviewsCount) { this.reviewsCount = reviewsCount; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public int getItemsBorrowed() { return itemsBorrowed; }
    public void setItemsBorrowed(int itemsBorrowed) { this.itemsBorrowed = itemsBorrowed; }

    public int getItemsLent() { return itemsLent; }
    public void setItemsLent(int itemsLent) { this.itemsLent = itemsLent; }

    public double getImpactSavedAmount() { return impactSavedAmount; }
    public void setImpactSavedAmount(double impactSavedAmount) { this.impactSavedAmount = impactSavedAmount; }

    public double getImpactKgKept() { return impactKgKept; }
    public void setImpactKgKept(double impactKgKept) { this.impactKgKept = impactKgKept; }
}
