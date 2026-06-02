package com.fashionify.backend.controller.common;

import com.fashionify.backend.entity.Feature;
import com.fashionify.backend.repository.FeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/common/feature")
public class FeatureController {

    @Autowired
    private FeatureRepository featureRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addFeatureImage(@RequestBody Feature feature) {
        Feature savedFeature = featureRepository.save(feature);
        return ResponseEntity.ok(Map.of("success", true, "data", savedFeature));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getFeatureImages() {
        List<Feature> features = featureRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", features));
    }
}
