
package com.jangir.jangir_it_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jangir.jangir_it_backend.entity.Contact;
import com.jangir.jangir_it_backend.repository.ContactRepository;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    // Public contact form se lead save karne ke liye
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    // Admin ke liye saari leads fetch karne ke liye
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    // Admin ke liye ek particular lead fetch karne ke liye
    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    // Admin ke liye lead ka status update karne ke liye
    public Contact updateStatus(Long id, String status) {

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        contact.setStatus(status);

        return contactRepository.save(contact);
    }

// Admin ke liye follow-up date aur notes update karne ke liye
public Contact updateFollowUp(
        Long id,
        LocalDateTime followUpDate,
        String adminNotes) {

    Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found"));

    contact.setFollowUpDate(followUpDate);
    contact.setAdminNotes(adminNotes);

    return contactRepository.save(contact);
}

    // Admin ke liye lead delete karne ke liye
public void deleteContact(Long id) {

    Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found"));

    contactRepository.delete(contact);
}
}