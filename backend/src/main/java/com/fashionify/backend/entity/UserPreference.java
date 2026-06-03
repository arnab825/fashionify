package com.fashionify.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks per-user tag preference scores for recommendation engine.
 * Score increments: cart add=+2, wishlist=+3, purchase=+5.
 * Future: can be extended with ML feature vectors.
 */
@Entity
@Table(name = "user_preferences",
       uniqueConstraints = @UniqueConstraint(name = "uq_user_tag", columnNames = {"user_id", "tag"}),
       indexes = {
           @Index(name = "idx_user_pref_user", columnList = "user_id"),
           @Index(name = "idx_user_pref_score", columnList = "user_id, score DESC")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "tag", nullable = false, length = 64)
    private String tag;

    @Column(name = "score", nullable = false)
    @Builder.Default
    private Integer score = 0;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
