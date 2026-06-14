package com.gpmitconnect.user;

import java.util.Comparator;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public UserProfileResponse me(@AuthenticationPrincipal User user) {
        return UserProfileResponse.from(user);
    }

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','HOD')")
    public List<UserProfileResponse> students() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .sorted(Comparator.comparing(User::getFullName))
                .map(UserProfileResponse::from)
                .toList();
    }

    @GetMapping("/directory")
    public List<UserProfileResponse> directory() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getRole).thenComparing(User::getFullName))
                .map(UserProfileResponse::from)
                .toList();
    }
}
