package com.gpmitconnect.opportunity;

public record OpportunityResponse(
        Long id,
        String title,
        String company,
        OpportunityType type,
        String location,
        String stipend,
        String applyUrl,
        String deadline,
        String description,
        String createdAt) {
}
