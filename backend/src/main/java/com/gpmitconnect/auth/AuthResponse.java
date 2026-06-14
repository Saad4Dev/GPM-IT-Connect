package com.gpmitconnect.auth;

import com.gpmitconnect.user.UserProfileResponse;

public record AuthResponse(
        String token,
        UserProfileResponse user) {
}
