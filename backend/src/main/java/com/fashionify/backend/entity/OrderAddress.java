package com.fashionify.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderAddress {
    private String addressId;
    private String address;
    private String city;
    private String pincode;
    private String phone;
    private String notes;
}
