package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/products")
public class ShopProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/get")
    public ResponseEntity<?> getFilteredProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false, defaultValue = "price-lowtohigh") String sortBy) {
            
        List<Product> products;
        
        if (category != null && !category.isEmpty() && brand != null && !brand.isEmpty()) {
            List<String> categories = Arrays.asList(category.split(","));
            List<String> brands = Arrays.asList(brand.split(","));
            products = productRepository.findByCategoryInAndBrandIn(categories, brands);
        } else {
            products = productRepository.findAll();
            
            // Apply filtering in memory if one is provided
            if (category != null && !category.isEmpty()) {
                List<String> categories = Arrays.asList(category.split(","));
                products = products.stream().filter(p -> categories.contains(p.getCategory())).collect(Collectors.toList());
            }
            if (brand != null && !brand.isEmpty()) {
                List<String> brands = Arrays.asList(brand.split(","));
                products = products.stream().filter(p -> brands.contains(p.getBrand())).collect(Collectors.toList());
            }
        }
        
        // Sorting
        switch (sortBy) {
            case "price-lowtohigh":
                products.sort((p1, p2) -> Double.compare(p1.getPrice(), p2.getPrice()));
                break;
            case "price-hightolow":
                products.sort((p1, p2) -> Double.compare(p2.getPrice(), p1.getPrice()));
                break;
            case "title-atoz":
                products.sort((p1, p2) -> p1.getTitle().compareToIgnoreCase(p2.getTitle()));
                break;
            case "title-ztoa":
                products.sort((p1, p2) -> p2.getTitle().compareToIgnoreCase(p1.getTitle()));
                break;
        }

        return ResponseEntity.ok(Map.of("success", true, "data", products));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getProductDetails(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(Map.of("success", true, "data", product)))
                .orElse(ResponseEntity.notFound().build());
    }
}
