package com.fashionify.backend.repository;

import com.fashionify.backend.entity.UserPreference;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    Optional<UserPreference> findByUserIdAndTag(Long userId, String tag);

    List<UserPreference> findByUserId(Long userId);

    // Returns top N tags by score for a user — used as input for recommendation query
    @Query("SELECT up.tag FROM UserPreference up WHERE up.userId = :userId ORDER BY up.score DESC")
    List<String> findTopTagsByUserId(@Param("userId") Long userId, Pageable pageable);

    // Upsert: increment score if exists, insert with initial score if not
    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO user_preferences (user_id, tag, score, updated_at)
        VALUES (:userId, :tag, :delta, NOW())
        ON DUPLICATE KEY UPDATE score = score + :delta, updated_at = NOW()
        """, nativeQuery = true)
    void upsertScore(@Param("userId") Long userId,
                     @Param("tag") String tag,
                     @Param("delta") int delta);
}
