package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.entity.ProductSizeVariant;
import com.fashionify.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
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

        List<Map<String, Object>> enriched = products.stream().map(this::enrichProduct).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("success", true, "data", enriched));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getProductDetails(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(Map.of("success", true, "data", enrichProduct(product))))
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> enrichProduct(Product product) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", product.getId());
        map.put("title", product.getTitle());
        map.put("description", product.getDescription());
        map.put("category", product.getCategory());
        map.put("brand", product.getBrand());
        map.put("price", product.getPrice());
        map.put("salePrice", product.getSalePrice());
        map.put("averageReview", product.getAverageReview());
        map.put("createdAt", product.getCreatedAt());
        map.put("updatedAt", product.getUpdatedAt());

        map.put("images", product.getImages());
        map.put("image", product.getImage());

        List<Map<String, Object>> variants = product.getSizeVariants().stream().map(v -> {
            Map<String, Object> vm = new LinkedHashMap<>();
            vm.put("id", v.getId());
            vm.put("size", v.getSize());
            vm.put("stock", v.getStock());
            vm.put("measurements", v.getMeasurements());
            vm.put("lowStock", v.getStock() <= 5 && v.getStock() > 0);
            vm.put("outOfStock", v.getStock() == 0);
            return vm;
        }).collect(Collectors.toList());
        map.put("sizeVariants", variants);

        int totalStock = product.getSizeVariants().stream().mapToInt(ProductSizeVariant::getStock).sum();
        map.put("totalStock", totalStock);

        return map;
    }
}
