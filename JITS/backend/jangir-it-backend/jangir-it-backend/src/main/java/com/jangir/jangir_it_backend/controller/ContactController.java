package com.jangir.jangir_it_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jangir.jangir_it_backend.entity.Contact;
import com.jangir.jangir_it_backend.service.ContactService;




@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
public Contact saveContact(@RequestBody Contact contact) {

    return contactService.saveContact(contact);

}

}