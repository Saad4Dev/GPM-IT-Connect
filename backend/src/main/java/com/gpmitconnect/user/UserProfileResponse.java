package com.gpmitconnect.user;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        String department,
        String yearOfStudy,
        String division,
        String phoneNumber) {

    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getYearOfStudy(),
                user.getDivision(),
                user.getPhoneNumber());
    }
}
