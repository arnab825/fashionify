package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.entity.ProductSizeVariant;
import com.fashionify.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    private static final int DEFAULT_PAGE_SIZE = 8;

    /**
     * GET /api/shop/products/get
     * Query params: category (CSV), brand (CSV), sortBy, page (0-indexed), size (default 8)
     * Returns: { products, currentPage, totalPages, totalProducts }
     */
    @GetMapping("/get")
    public ResponseEntity<?> getFilteredProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false, defaultValue = "price-lowtohigh") String sortBy,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "8") int size) {

        Sort sort = buildSort(sortBy);
        PageRequest pageRequest = PageRequest.of(page, Math.min(size, DEFAULT_PAGE_SIZE), sort);

        Page<Product> productPage;

        if (category != null && !category.isEmpty() && brand != null && !brand.isEmpty()) {
            List<String> categories = Arrays.asList(category.split(","));
            List<String> brands = Arrays.asList(brand.split(","));
            productPage = productRepository.findByCategoryInAndBrandIn(categories, brands, pageRequest);
        } else if (category != null && !category.isEmpty()) {
            List<String> categories = Arrays.asList(category.split(","));
            productPage = productRepository.findByCategoryIn(categories, pageRequest);
        } else if (brand != null && !brand.isEmpty()) {
            List<String> brands = Arrays.asList(brand.split(","));
            productPage = productRepository.findByBrandIn(brands, pageRequest);
        } else {
            productPage = productRepository.findAll(pageRequest);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("products", productPage.getContent().stream().map(this::enrichProduct).collect(Collectors.toList()));
        response.put("currentPage", productPage.getNumber());
        response.put("totalPages", productPage.getTotalPages());
        response.put("totalProducts", productPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getProductDetails(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(Map.of("success", true, "data", enrichProduct(product))))
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Sort buildSort(String sortBy) {
        switch (sortBy) {
            case "price-lowtohigh":  return Sort.by(Sort.Direction.ASC, "price");
            case "price-hightolow":  return Sort.by(Sort.Direction.DESC, "price");
            case "title-atoz":       return Sort.by(Sort.Direction.ASC, "title");
            case "title-ztoa":       return Sort.by(Sort.Direction.DESC, "title");
            default:                 return Sort.by(Sort.Direction.ASC, "price");
        }
    }

    public Map<String, Object> enrichProduct(Product product) {
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
        map.put("tags", product.getTags() != null ? product.getTags() : List.of());

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
