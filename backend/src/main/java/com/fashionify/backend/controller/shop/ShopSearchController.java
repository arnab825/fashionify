package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/search")
public class ShopSearchController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShopProductController shopProductController;

    @GetMapping("/{keyword}")
    public ResponseEntity<?> searchProducts(
            @PathVariable String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Keyword is required"));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "title"));
        Page<Product> results = productRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        keyword, keyword, pageRequest);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results.getContent().stream()
                        .map(shopProductController::enrichProduct)
                        .collect(Collectors.toList()),
                "currentPage", results.getNumber(),
                "totalPages", results.getTotalPages(),
                "totalProducts", results.getTotalElements()
        ));
    }
}
