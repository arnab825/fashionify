package com.fashionify.backend.controller.shop;

import com.fashionify.backend.entity.Product;
import com.fashionify.backend.repository.OrderRepository;
import com.fashionify.backend.repository.ProductRepository;
import com.fashionify.backend.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Provides personalized product recommendations based on user tag preference scores.
 *
 * Algorithm:
 *   1. Fetch user's top 5 tags by score from user_preferences.
 *   2. Find products matching any of those tags (via JPQL JOIN on product_tags).
 *   3. Exclude products the user has already purchased (confirmed orders).
 *   4. Sort by number of overlapping tags (descending) for relevance.
 *   5. Falls back to newest products if no preference data exists.
 *
 * Future-ready: replace steps 1-4 with an ML embedding similarity lookup
 * without touching the API contract.
 */
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/shop/recommendations")
public class RecommendationController {

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShopProductController shopProductController;

    @GetMapping
    public ResponseEntity<?> getRecommendations(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "8") int limit) {

        // Step 1: get user's top 5 tags
        List<String> topTags = preferenceRepository.findTopTagsByUserId(userId, PageRequest.of(0, 5));

        List<Map<String, Object>> recommendations;

        if (topTags.isEmpty()) {
            // Cold start: return newest products
            recommendations = productRepository
                    .findAll(PageRequest.of(0, limit, org.springframework.data.domain.Sort.by(
                            org.springframework.data.domain.Sort.Direction.DESC, "createdAt")))
                    .getContent()
                    .stream()
                    .map(shopProductController::enrichProduct)
                    .collect(Collectors.toList());
        } else {
            // Step 2: get already-purchased product IDs to exclude
            List<String> purchasedStringIds = orderRepository.findPurchasedProductIdsByUserId(userId);
            List<Long> excludeIds = purchasedStringIds.stream()
                    .map(s -> {
                        try { return Long.parseLong(s); } catch (NumberFormatException e) { return null; }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            if (excludeIds.isEmpty()) excludeIds = List.of(-1L); // avoid empty IN clause

            // Step 3: query products matching any top tag, excluding purchased
            List<Product> candidates = productRepository.findByTagsInExcluding(
                    topTags, excludeIds, PageRequest.of(0, limit * 3));

            // Step 4: sort by number of overlapping tags (most relevant first)
            Set<String> topTagSet = new HashSet<>(topTags);
            recommendations = candidates.stream()
                    .sorted(Comparator.comparingInt((Product p) ->
                            (int) p.getTags().stream().filter(topTagSet::contains).count()).reversed())
                    .limit(limit)
                    .map(shopProductController::enrichProduct)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(Map.of("success", true, "data", recommendations, "basedOnTags", topTags));
    }
}
