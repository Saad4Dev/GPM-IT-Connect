package com.gpmitconnect.opportunity;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityRepository opportunityRepository;

    public OpportunityController(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    @GetMapping
    public List<OpportunityResponse> all() {
        return opportunityRepository.findAll().stream()
                .sorted(Comparator.comparing(Opportunity::getDeadline))
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','HOD')")
    public OpportunityResponse create(@Valid @RequestBody OpportunityRequest request) {
        Opportunity opportunity = new Opportunity();
        opportunity.setTitle(request.title());
        opportunity.setCompany(request.company());
        opportunity.setType(request.type());
        opportunity.setLocation(request.location());
        opportunity.setStipend(request.stipend());
        opportunity.setApplyUrl(request.applyUrl());
        opportunity.setDeadline(request.deadline());
        opportunity.setDescription(request.description());
        opportunity.setCreatedAt(LocalDateTime.now());
        return toResponse(opportunityRepository.save(opportunity));
    }

    private OpportunityResponse toResponse(Opportunity opportunity) {
        return new OpportunityResponse(
                opportunity.getId(),
                opportunity.getTitle(),
                opportunity.getCompany(),
                opportunity.getType(),
                opportunity.getLocation(),
                opportunity.getStipend(),
                opportunity.getApplyUrl(),
                opportunity.getDeadline().toString(),
                opportunity.getDescription(),
                opportunity.getCreatedAt().toString());
    }
}
