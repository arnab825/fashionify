package com.fashionify.backend.controller.admin;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.entity.ProductSizeVariant;
import com.fashionify.backend.repository.ProductRepository;
import com.fashionify.backend.repository.ProductSizeVariantRepository;
import com.fashionify.backend.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSizeVariantRepository sizeVariantRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    // ── Image Upload ─────────────────────────────────────────────────────────
    @PostMapping("/upload-image")
    public ResponseEntity<?> handleImageUpload(@RequestParam("my_file") MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file, "products");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("result", Map.of("url", url));
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Error uploading image"));
        }
    }

    // ── Add Product ──────────────────────────────────────────────────────────
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> payload) {
        Product product = buildProductFromPayload(payload, new Product());
        Product saved = productRepository.save(product);
        saveVariants(saved, payload);
        return ResponseEntity.ok(Map.of("success", true, "data", enrichProduct(saved)));
    }

    // ── Get All Products ──────────────────────────────────────────────────────
    @GetMapping("/get")
    public ResponseEntity<?> fetchAllProducts() {
        List<Map<String, Object>> enriched = productRepository.findAll()
                .stream().map(this::enrichProduct).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("success", true, "data", enriched));
    }

    // ── Low-Stock Alert Endpoint (any size stock ≤ 5) ────────────────────────
    @GetMapping("/low-stock")
    public ResponseEntity<?> getLowStockProducts() {
        List<Map<String, Object>> lowStock = productRepository.findAll().stream()
                .filter(p -> p.getSizeVariants().stream().anyMatch(v -> v.getStock() <= 5))
                .map(this::enrichProduct)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("success", true, "data", lowStock));
    }

    // ── Edit Product ─────────────────────────────────────────────────────────
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editProduct(@PathVariable Long id,
                                          @RequestBody Map<String, Object> payload) {
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Product product = opt.get();
        buildProductFromPayload(payload, product);
        Product saved = productRepository.save(product);

        // Replace variants
        sizeVariantRepository.deleteAll(sizeVariantRepository.findByProductId(id));
        saveVariants(saved, payload);

        // Reload
        Product reloaded = productRepository.findById(saved.getId()).orElse(saved);
        return ResponseEntity.ok(Map.of("success", true, "data", enrichProduct(reloaded)));
    }

    // ── Delete Product ────────────────────────────────────────────────────────
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    private Product buildProductFromPayload(Map<String, Object> payload, Product product) {
        if (payload.containsKey("title"))       product.setTitle((String) payload.get("title"));
        if (payload.containsKey("description")) product.setDescription((String) payload.get("description"));
        if (payload.containsKey("category"))    product.setCategory((String) payload.get("category"));
        if (payload.containsKey("brand"))       product.setBrand((String) payload.get("brand"));
        if (payload.containsKey("averageReview")) {
            Object ar = payload.get("averageReview");
            product.setAverageReview(ar == null ? 0.0 : Double.parseDouble(ar.toString()));
        }
        if (payload.containsKey("price")) {
            product.setPrice(Double.parseDouble(payload.get("price").toString()));
        }
        if (payload.containsKey("salePrice")) {
            Object sp = payload.get("salePrice");
            product.setSalePrice(sp == null || sp.toString().isEmpty() ? null
                    : Double.parseDouble(sp.toString()));
        }
        // Images list
        if (payload.containsKey("images")) {
            List<String> imgs = (List<String>) payload.get("images");
            product.setImages(imgs != null ? imgs : new ArrayList<>());
        }
        return product;
    }

    @SuppressWarnings("unchecked")
    private void saveVariants(Product product, Map<String, Object> payload) {
        if (!payload.containsKey("sizeVariants")) return;
        List<Map<String, Object>> variants = (List<Map<String, Object>>) payload.get("sizeVariants");
        if (variants == null) return;
        for (Map<String, Object> v : variants) {
            ProductSizeVariant variant = ProductSizeVariant.builder()
                    .product(product)
                    .size((String) v.get("size"))
                    .stock(Integer.parseInt(v.get("stock").toString()))
                    .measurements(v.containsKey("measurements") ? (String) v.get("measurements") : null)
                    .build();
            sizeVariantRepository.save(variant);
        }
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

        // Images
        map.put("images", product.getImages());
        map.put("image", product.getImage()); // first image, backward compat

        // Size variants enriched with lowStock flag
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

        // Computed totals
        int totalStock = product.getSizeVariants().stream().mapToInt(ProductSizeVariant::getStock).sum();
        map.put("totalStock", totalStock);
        boolean hasLowStock = product.getSizeVariants().stream().anyMatch(v -> v.getStock() <= 5 && v.getStock() > 0);
        map.put("hasLowStock", hasLowStock);

        return map;
    }
}
