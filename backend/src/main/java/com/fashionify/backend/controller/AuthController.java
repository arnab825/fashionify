package com.fashionify.backend.controller;

import com.fashionify.backend.dto.JwtResponse;
import com.fashionify.backend.dto.LoginRequest;
import com.fashionify.backend.dto.MessageResponse;
import com.fashionify.backend.dto.RegisterRequest;
import com.fashionify.backend.entity.User;
import com.fashionify.backend.repository.UserRepository;
import com.fashionify.backend.security.JwtUtils;
import com.fashionify.backend.security.UserDetailsImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(false, "Error: Email is already in use!"));
        }

        if (userRepository.existsByUserName(signUpRequest.getUserName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(false, "Error: Username is already taken!"));
        }

        long userCount = userRepository.count();
        String role = (userCount == 0) ? "admin" : "user";

        // Create new user's account
        User user = new User(
                null,
                signUpRequest.getUserName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                role, // Dynamic role: first user gets admin
                null,
                null
        );

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse(true, "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Cookie cookie = new Cookie("token", jwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24);
        // SameSite=Lax allows the cookie to be sent on same-site navigations and top-level cross-site GET
        response.addCookie(cookie);
        response.addHeader("Set-Cookie",
            "token=" + jwt + "; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax");

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("email", userDetails.getEmail());
        userMap.put("role", userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").toLowerCase());
        userMap.put("id", userDetails.getId());
        userMap.put("userName", userDetails.getUsername());

        return ResponseEntity.ok(new JwtResponse(true, "Logged in successfully", userMap));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(new MessageResponse(true, "Logged out successfully!"));
    }

    @GetMapping("/check-auth")
    public ResponseEntity<?> checkAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse(false, "Unauthorised user!"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("email", userDetails.getEmail());
        userMap.put("role", userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").toLowerCase());
        userMap.put("id", userDetails.getId());
        userMap.put("userName", userDetails.getUsername());

        return ResponseEntity.ok(new JwtResponse(true, "Authenticated user!", userMap));
    }
}
