package com.jangir.jangir_it_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jangir.jangir_it_backend.dto.ContactFollowUpRequest;
import com.jangir.jangir_it_backend.dto.ContactStatusRequest;
import com.jangir.jangir_it_backend.entity.Contact;
import com.jangir.jangir_it_backend.service.ContactService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")

public class AdminController {

    private final ContactService contactService;

    public AdminController(ContactService contactService) {
        this.contactService = contactService;
    }

    // Saari leads fetch karne ke liye
    @GetMapping("/contacts")
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    // Ek particular lead fetch karne ke liye
    @GetMapping("/contacts/{id}")
    public Contact getContactById(@PathVariable Long id) {
        return contactService.getContactById(id);
    }

 

    // Lead ka status update karne ke liye
    @PatchMapping("/contacts/{id}/status")
    public Contact updateContactStatus(
            @PathVariable Long id,
            @RequestBody ContactStatusRequest request) {

        return contactService.updateStatus(id, request.getStatus());
    }

    // Lead ka follow-up date aur admin notes update karne ke liye
@PatchMapping("/contacts/{id}/follow-up")
public Contact updateContactFollowUp(
        @PathVariable Long id,
        @RequestBody ContactFollowUpRequest request) {

    return contactService.updateFollowUp(
            id,
            request.getFollowUpDate(),
            request.getAdminNotes()
    );
}


    
       // Lead delete karne ke liye
@DeleteMapping("/contacts/{id}")
public String deleteContact(@PathVariable Long id) {

    contactService.deleteContact(id);

    return "Contact deleted successfully";
}
}