package com.jangir.jangir_it_backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phone;

    private String service;

    private String message;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


    @Column(name = "follow_up_date")
private LocalDateTime followUpDate;

@Column(name = "admin_notes", columnDefinition = "TEXT")
private String adminNotes;

    // Default constructor
    public Contact() {
    }

    // Full constructor
    public Contact(
            Long id,
            String name,
            String email,
            String phone,
            String service,
            String message,
            String status,
            LocalDateTime createdAt) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.service = service;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }

    // New contact create hone par default values
    @PrePersist
    protected void onCreate() {

        if (status == null || status.isBlank()) {
            status = "NEW";
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getFollowUpDate() {
    return followUpDate;
}

public void setFollowUpDate(LocalDateTime followUpDate) {
    this.followUpDate = followUpDate;
}

public String getAdminNotes() {
    return adminNotes;
}

public void setAdminNotes(String adminNotes) {
    this.adminNotes = adminNotes;
}
}