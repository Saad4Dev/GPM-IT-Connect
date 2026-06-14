package com.gpmitconnect.resource;

public record ResourceResponse(
        Long id,
        String title,
        String description,
        ResourceType type,
        String resourceUrl,
        String subjectName,
        String uploadedAt,
        String uploader) {
}
