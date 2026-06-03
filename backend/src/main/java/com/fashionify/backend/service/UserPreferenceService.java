package com.fashionify.backend.service;

import com.fashionify.backend.repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for updating user tag preference scores.
 *
 * Scoring policy:
 *   - Add to cart: +2
 *   - Add to wishlist: +3
 *   - Purchase (order confirmed): +5
 *
 * Architecture note: this service is a clean seam for future ML integration.
 * Tag scores can later feed into collaborative filtering or embedding models.
 */
@Service
public class UserPreferenceService {

    @Autowired
    private UserPreferenceRepository preferenceRepository;

    /**
     * Record a user interaction with a list of product tags.
     * @param userId    the user performing the interaction
     * @param tags      the tags on the interacted product
     * @param scoreDelta how much to add per tag (e.g., 2, 3, or 5)
     */
    public void recordInteraction(Long userId, List<String> tags, int scoreDelta) {
        if (userId == null || tags == null || tags.isEmpty()) return;
        for (String tag : tags) {
            if (tag != null && !tag.isBlank()) {
                preferenceRepository.upsertScore(userId, tag.trim(), scoreDelta);
            }
        }
    }
}
