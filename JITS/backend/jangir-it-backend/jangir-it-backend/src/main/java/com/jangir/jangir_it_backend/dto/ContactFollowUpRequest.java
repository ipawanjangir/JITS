package com.jangir.jangir_it_backend.dto;

import java.time.LocalDateTime;

public class ContactFollowUpRequest {

    private LocalDateTime followUpDate;

    private String adminNotes;

    // Default constructor
    public ContactFollowUpRequest() {
    }

    // Getter - Follow Up Date
    public LocalDateTime getFollowUpDate() {
        return followUpDate;
    }

    // Setter - Follow Up Date
    public void setFollowUpDate(LocalDateTime followUpDate) {
        this.followUpDate = followUpDate;
    }

    // Getter - Admin Notes
    public String getAdminNotes() {
        return adminNotes;
    }

    // Setter - Admin Notes
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}