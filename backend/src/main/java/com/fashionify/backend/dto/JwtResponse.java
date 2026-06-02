package com.fashionify.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private boolean success;
    private String message;
    private Object user;
}
