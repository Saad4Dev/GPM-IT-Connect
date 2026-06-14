package com.gpmitconnect.notice;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NoticeRequest(
        @NotBlank String title,
        @NotBlank String content,
        @NotNull NoticeCategory category,
        boolean pinned) {
}
