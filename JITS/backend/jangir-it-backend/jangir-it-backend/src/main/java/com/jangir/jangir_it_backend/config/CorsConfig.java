package com.jangir.jangir_it_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration.
 *
 * Beginner ke liye: is class ka kaam hai backend ko batana ki
 * "sirf ye wali website (origin) mujhse baat kar sakti hai".
 *
 * Isse har naye Controller (Lead, Auth, Dashboard...) mein baar-baar
 * @CrossOrigin likhne ki zaroorat nahi — ek jagah define karo,
 * poore application mein apply ho jayega.
 *
 * allowedOrigin ki value application.properties se aati hai
 * (app.cors.allowed-origin) — matlab jab real domain milega,
 * sirf properties file mein ek line badalni hogi, code touch
 * nahi karna padega.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigin)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}