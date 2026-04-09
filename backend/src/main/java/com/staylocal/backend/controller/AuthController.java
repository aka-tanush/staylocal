package com.staylocal.backend.controller;

import com.staylocal.backend.dto.AuthResponse;
import com.staylocal.backend.dto.LoginRequest;
import com.staylocal.backend.dto.RegisterRequest;
import com.staylocal.backend.dto.UserResponse;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ✅ REGISTER API
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("REGISTER API HIT"); // debug log
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    // ✅ LOGIN API
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ✅ GET CURRENT USER
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.getMe(user));
    }
}