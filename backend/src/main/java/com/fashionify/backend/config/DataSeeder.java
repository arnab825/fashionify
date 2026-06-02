package com.fashionify.backend.config;

import com.fashionify.backend.entity.User;
import com.fashionify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                    null,
                    "Admin",
                    adminEmail,
                    passwordEncoder.encode("admin123"),
                    "admin",
                    null,
                    null
            );
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@gmail.com / admin123");
        }
    }
}
