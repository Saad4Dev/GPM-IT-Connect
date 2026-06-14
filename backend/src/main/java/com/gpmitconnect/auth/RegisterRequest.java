package com.gpmitconnect.auth;

import com.gpmitconnect.user.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @NotBlank String password,
        Role role,
        String yearOfStudy,
        String division,
        String phoneNumber) {
}
