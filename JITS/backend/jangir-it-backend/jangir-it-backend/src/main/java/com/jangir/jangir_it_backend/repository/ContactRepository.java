package com.jangir.jangir_it_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jangir.jangir_it_backend.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {

}