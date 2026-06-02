package com.fashionify.backend.controller.admin;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.repository.ProductRepository;
import com.fashionify.backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin/products")
//@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/upload-image")
    public ResponseEntity<?> handleImageUpload(@RequestParam("my_file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file, "products");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("result", Map.of("url", url));
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error uploading image"));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(Map.of("success", true, "data", savedProduct));
    }

    @GetMapping("/get")
    public ResponseEntity<?> fetchAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", products));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setTitle(productDetails.getTitle());
            product.setDescription(productDetails.getDescription());
            product.setCategory(productDetails.getCategory());
            product.setBrand(productDetails.getBrand());
            product.setPrice(productDetails.getPrice());
            product.setSalePrice(productDetails.getSalePrice());
            product.setTotalStock(productDetails.getTotalStock());
            product.setImage(productDetails.getImage());
            product.setAverageReview(productDetails.getAverageReview());
            
            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(Map.of("success", true, "data", updatedProduct));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
