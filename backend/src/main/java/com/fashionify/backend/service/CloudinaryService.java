package com.fashionify.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folderName) throws IOException {
        @SuppressWarnings("unchecked")
        Map<String, Object> options = ObjectUtils.asMap(
            "folder", "fashionify/" + folderName,
            "resource_type", "image"
        );
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        // Use secure_url to get HTTPS; fall back to url if not present
        Object secureUrl = uploadResult.get("secure_url");
        return secureUrl != null ? secureUrl.toString() : uploadResult.get("url").toString();
    }
}
