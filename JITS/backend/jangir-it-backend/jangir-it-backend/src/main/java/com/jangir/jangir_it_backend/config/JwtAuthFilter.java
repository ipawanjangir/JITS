package com.jangir.jangir_it_backend.config;

import java.io.IOException;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jangir.jangir_it_backend.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JwtAuthFilter — har incoming request pe ek baar chalta hai (isliye
 * OncePerRequestFilter extend kiya hai), aur check karta hai:
 * "Is request ke saath valid login token attached hai kya?"
 *
 * Beginner ke liye: socho ye ek "security guard" hai jo entrance
 * gate pe khada hai. Har request (jaise GET /api/leads) jab bhi
 * backend tak pahunchne ki koshish karti hai, ye guard pehle
 * "Authorization" header check karta hai:
 *
 *   Authorization: Bearer <token>
 *
 * Agar token sahi hai → request ko aage jaane dega, aur Spring
 * Security ko bata dega "ye request is username ki taraf se hai".
 * Agar token galat/missing hai → request bina authentication ke
 * aage badhegi, aur agar wo URL protected hai (SecurityConfig mein
 * decide hota hai), Spring Security khud usse 403 de dega.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7); // "Bearer " ke baad ka part

            if (jwtUtil.validateToken(token)) {

                String username = jwtUtil.getUsernameFromToken(token);
String role = jwtUtil.getRoleFromToken(token);
                // Spring Security ko batate hain "ye user authenticated hai"
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));

                        
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}