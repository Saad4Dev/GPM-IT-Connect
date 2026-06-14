package com.gpmitconnect.auth;

import com.gpmitconnect.security.JwtService;
import com.gpmitconnect.user.Role;
import com.gpmitconnect.user.User;
import com.gpmitconnect.user.UserProfileResponse;
import com.gpmitconnect.user.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists with this email");
        }

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() == null ? Role.STUDENT : request.role());
        user.setDepartment("Information Technology");
        user.setYearOfStudy(request.yearOfStudy());
        user.setDivision(request.division());
        user.setPhoneNumber(request.phoneNumber());

        User saved = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(saved), UserProfileResponse.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new AuthResponse(jwtService.generateToken(user), UserProfileResponse.from(user));
    }
}
