package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.entity.Review;
import com.fashionify.backend.entity.User;
import com.fashionify.backend.repository.ProductRepository;
import com.fashionify.backend.repository.ReviewRepository;
import com.fashionify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/review")
public class ShopReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Map<String, String> payload) {
        Long productId = Long.parseLong(payload.get("productId"));
        Long userId = Long.parseLong(payload.get("userId"));
        String userName = payload.get("userName");
        String reviewMessage = payload.get("reviewMessage");
        Integer reviewValue = Integer.parseInt(payload.get("reviewValue"));

        Optional<Product> productOpt = productRepository.findById(productId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (productOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User or Product not found"));
        }

        // Check if user already reviewed
        List<Review> existingReviews = reviewRepository.findByProductId(productId);
        boolean alreadyReviewed = existingReviews.stream().anyMatch(r -> r.getUser().getId().equals(userId));
        
        if (alreadyReviewed) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "You already reviewed this product!"));
        }

        Review review = Review.builder()
                .product(productOpt.get())
                .user(userOpt.get())
                .userName(userName)
                .reviewMessage(reviewMessage)
                .reviewValue(reviewValue)
                .build();

        reviewRepository.save(review);
        
        // Update product average rating
        List<Review> allReviews = reviewRepository.findByProductId(productId);
        double avg = allReviews.stream().mapToInt(Review::getReviewValue).average().orElse(0.0);
        
        Product product = productOpt.get();
        product.setAverageReview(avg);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of("success", true, "data", review));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return ResponseEntity.ok(Map.of("success", true, "data", reviews));
    }
}
