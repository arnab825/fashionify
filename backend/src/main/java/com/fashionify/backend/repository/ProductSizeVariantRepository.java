package com.fashionify.backend.repository;

import com.fashionify.backend.entity.ProductSizeVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductSizeVariantRepository extends JpaRepository<ProductSizeVariant, Long> {
    List<ProductSizeVariant> findByProductId(Long productId);
}
