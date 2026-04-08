package com.staylocal.backend.controller;

import com.staylocal.backend.dto.ReviewRequest;
import com.staylocal.backend.dto.ReviewResponse;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{homestayId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByHomestay(@PathVariable Long homestayId) {
        return ResponseEntity.ok(reviewService.getReviewsByHomestay(homestayId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request, @AuthenticationPrincipal User user) {
        return new ResponseEntity<>(reviewService.createReview(request, user), HttpStatus.CREATED);
    }
}
