package com.poly.beeshoes.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

@Component
public class CloudinaryUtils {
    @Async
    public Future<List<String>> uploadMultipleImages(List<MultipartFile> imageFiles, String folder) {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String imageUrl = String.valueOf(uploadSingleImage(imageFile, folder));
            if (imageUrl != null) {
                imageUrls.add(imageUrl);
            }
        }
        return new AsyncResult<>(imageUrls);
    }

    public String uploadSingleImage(MultipartFile imageFile, String folder) {
        try {
            Map<String, String> uploadOptions = ObjectUtils.asMap(
                    "folder", folder
            );
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", "beeshoes",
                    "api_key", "532144793489458",
                    "api_secret", "ybMZlE8rrX5AYNg_-wi_C1r6g8A"));
            Map<String, String> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), uploadOptions);
            return uploadResult.get("url");
        } catch (IOException e) {
            throw new RestApiException("Không thể tải lên hình ảnh!");
        }
    }
}
