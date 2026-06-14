package com.gpmitconnect.resource;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResourceRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull ResourceType type,
        @NotBlank String resourceUrl,
        @NotBlank String subjectName) {
}
