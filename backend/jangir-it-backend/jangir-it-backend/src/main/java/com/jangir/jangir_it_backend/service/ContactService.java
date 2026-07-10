package com.jangir.jangir_it_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jangir.jangir_it_backend.entity.Contact;
import com.jangir.jangir_it_backend.repository.ContactRepository;

@Service
public class ContactService {

    @Autowired
private ContactRepository contactRepository;

public Contact saveContact(Contact contact) {

    return contactRepository.save(contact);

}

}