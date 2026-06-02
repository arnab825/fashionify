package com.fashionify.backend.repository;

import com.fashionify.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryInAndBrandIn(List<String> categories, List<String> brands);
    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String keyword1, String keyword2);
}
