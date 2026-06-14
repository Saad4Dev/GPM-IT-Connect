package com.gpmitconnect.ai;

import jakarta.validation.constraints.NotBlank;

public record AiPromptRequest(@NotBlank String prompt) {
}
