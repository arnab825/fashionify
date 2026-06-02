package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/search")
public class ShopSearchController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/{keyword}")
    public ResponseEntity<?> searchProducts(@PathVariable String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Keyword is required"));
        }
        
        List<Product> products = productRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        return ResponseEntity.ok(Map.of("success", true, "data", products));
    }
}
