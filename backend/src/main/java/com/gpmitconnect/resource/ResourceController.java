package com.gpmitconnect.resource;

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
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceRepository resourceRepository;

    public ResourceController(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @GetMapping
    public List<ResourceResponse> all() {
        return resourceRepository.findAll().stream()
                .sorted(Comparator.comparing(AcademicResource::getUploadedAt).reversed())
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','HOD')")
    public ResourceResponse create(@Valid @RequestBody ResourceRequest request, @AuthenticationPrincipal User user) {
        AcademicResource resource = new AcademicResource();
        resource.setTitle(request.title());
        resource.setDescription(request.description());
        resource.setType(request.type());
        resource.setResourceUrl(request.resourceUrl());
        resource.setSubjectName(request.subjectName());
        resource.setUploadedAt(LocalDateTime.now());
        resource.setUploader(user);
        return toResponse(resourceRepository.save(resource));
    }

    private ResourceResponse toResponse(AcademicResource resource) {
        return new ResourceResponse(
                resource.getId(),
                resource.getTitle(),
                resource.getDescription(),
                resource.getType(),
                resource.getResourceUrl(),
                resource.getSubjectName(),
                resource.getUploadedAt().toString(),
                resource.getUploader().getFullName());
    }
}
