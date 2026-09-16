package com.rewrap.model;

public class Transaction {
    private String id;
    private String itemId;
    private Item item;
    private User borrower;
    private String startDate;
    private String endDate;
    private int durationDays;
    private double totalCost;
    private String status; // pending, approved, active, completed, returned, rejected
    private String type; // borrowing, lending
    private String pickupMethod; // locker, person
    private String lockerCode;
    private String lockerNumber;
    private String lockerValidUntil;
    private String createdAt;

    public Transaction() {}

    public Transaction(String id, String itemId, Item item, User borrower, String startDate,
                       String endDate, int durationDays, double totalCost, String status,
                       String type, String pickupMethod, String lockerCode, String lockerNumber,
                       String lockerValidUntil, String createdAt) {
        this.id = id;
        this.itemId = itemId;
        this.item = item;
        this.borrower = borrower;
        this.startDate = startDate;
        this.endDate = endDate;
        this.durationDays = durationDays;
        this.totalCost = totalCost;
        this.status = status;
        this.type = type;
        this.pickupMethod = pickupMethod;
        this.lockerCode = lockerCode;
        this.lockerNumber = lockerNumber;
        this.lockerValidUntil = lockerValidUntil;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public User getBorrower() { return borrower; }
    public void setBorrower(User borrower) { this.borrower = borrower; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }

    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPickupMethod() { return pickupMethod; }
    public void setPickupMethod(String pickupMethod) { this.pickupMethod = pickupMethod; }

    public String getLockerCode() { return lockerCode; }
    public void setLockerCode(String lockerCode) { this.lockerCode = lockerCode; }

    public String getLockerNumber() { return lockerNumber; }
    public void setLockerNumber(String lockerNumber) { this.lockerNumber = lockerNumber; }

    public String getLockerValidUntil() { return lockerValidUntil; }
    public void setLockerValidUntil(String lockerValidUntil) { this.lockerValidUntil = lockerValidUntil; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
