package com.gpmitconnect.notice;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import com.gpmitconnect.user.User;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeRepository noticeRepository;

    public NoticeController(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    @GetMapping
    public List<NoticeResponse> all() {
        return noticeRepository.findAll().stream()
                .sorted(Comparator.comparing(Notice::isPinned).reversed().thenComparing(Notice::getPublishedAt).reversed())
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','HOD')")
    public NoticeResponse create(@Valid @RequestBody NoticeRequest request, @AuthenticationPrincipal User user) {
        Notice notice = new Notice();
        notice.setTitle(request.title());
        notice.setContent(request.content());
        notice.setCategory(request.category());
        notice.setPinned(request.pinned());
        notice.setPublishedAt(LocalDateTime.now());
        notice.setAuthor(user);
        return toResponse(noticeRepository.save(notice));
    }

    private NoticeResponse toResponse(Notice notice) {
        return new NoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getCategory(),
                notice.isPinned(),
                notice.getPublishedAt().toString(),
                notice.getAuthor().getFullName());
    }
}
