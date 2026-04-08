package com.staylocal.backend.service;

import com.staylocal.backend.dto.UpdateProfileRequest;
import com.staylocal.backend.dto.UserResponse;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserProfile(User user) {
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateUserProfile(User user, UpdateProfileRequest request) {
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getProfilePicture() != null) user.setProfilePicture(request.getProfilePicture());

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
