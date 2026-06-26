package com.fashionify.backend.repository;

import com.fashionify.backend.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findTopByEmailOrderByCreatedAtDesc(String email);
    void deleteAllByEmail(String email);
}
