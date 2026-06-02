package com.fashionify.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_size_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSizeVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Product product;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private Integer stock;

    // Optional: measurement details like "Chest: 40\", Waist: 32\""
    @Column(columnDefinition = "TEXT")
    private String measurements;
}
