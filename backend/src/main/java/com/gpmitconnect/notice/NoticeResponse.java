package com.gpmitconnect.notice;

public record NoticeResponse(
        Long id,
        String title,
        String content,
        NoticeCategory category,
        boolean pinned,
        String publishedAt,
        String author) {
}
