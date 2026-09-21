package com.jangir.jangir_it_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * User entity — admin login ke liye.
 *
 * Beginner ke liye: "password" field mein KABHI BHI plain text
 * password store nahi hoga. Jab bhi koi user banayenge, password ko
 * pehle BCrypt se "hash" (encrypt) karke yahan save karenge.
 * Isliye is table mein password dekhoge toh ek lambi si random
 * string dikhegi (jaise $2a$10$abcd...), asal password kabhi nahi.
 */
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // Abhi simple rakha hai — ek user ka ek hi role hoga (jaise "ADMIN").
    // Future mein zyada roles chahiye (jaise "MANAGER") toh isi field
    // mein naya string daal sakte ho, structure badalne ki zaroorat nahi.
    @Column(nullable = false)
    private String role;

    public User() {
    }

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}