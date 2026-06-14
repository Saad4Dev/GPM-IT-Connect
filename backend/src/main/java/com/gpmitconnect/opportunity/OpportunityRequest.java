package com.gpmitconnect.opportunity;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OpportunityRequest(
        @NotBlank String title,
        @NotBlank String company,
        @NotNull OpportunityType type,
        @NotBlank String location,
        @NotBlank String stipend,
        @NotBlank String applyUrl,
        @NotNull LocalDate deadline,
        @NotBlank String description) {
}
