package com.jangir.jangir_it_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jangir.jangir_it_backend.entity.User;

/**
 * UserRepository — database se User data read/write karne ke liye.
 *
 * findByUsername() — Spring Data JPA ka "magic method" hai.
 * Hume iska SQL query khud likhne ki zaroorat nahi — sirf method
 * ka naam sahi convention mein likho ("findBy" + field name),
 * Spring Boot automatically samajh jaata hai query kya banani hai.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}