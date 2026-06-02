package com.fashionify.backend.controller.admin;

import com.fashionify.backend.entity.User;
import com.fashionify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/get")
    public ResponseEntity<?> getAllUsersForAdmin() {
        // Exclude passwords from response for security if DTO was used, but since we are returning entity we should ideally map it.
        // For simplicity, we just return it here as role management is internal.
        List<User> users = userRepository.findAll();
        // Nullify passwords to be safe
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(Map.of("success", true, "data", users));
    }

    @PutMapping("/update-role/{id}")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String newRole = payload.get("role");
            if (newRole != null && (newRole.equals("admin") || newRole.equals("user"))) {
                user.setRole(newRole);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("success", true, "message", "User role updated successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid role"));
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
