package com.staylocal.backend.service;

import com.staylocal.backend.dto.ReviewRequest;
import com.staylocal.backend.dto.ReviewResponse;
import com.staylocal.backend.entity.Homestay;
import com.staylocal.backend.entity.Review;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.repository.HomestayRepository;
import com.staylocal.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final HomestayRepository homestayRepository;

    public List<ReviewResponse> getReviewsByHomestay(Long homestayId) {
        Homestay homestay = homestayRepository.findById(homestayId)
                .orElseThrow(() -> new RuntimeException("Homestay not found"));
        return reviewRepository.findByHomestay(homestay).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, User user) {
        Homestay homestay = homestayRepository.findById(request.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Homestay not found"));

        Review review = Review.builder()
                .homestay(homestay)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update homestay rating and numReviews
        List<Review> reviews = reviewRepository.findByHomestay(homestay);
        int numReviews = reviews.size();
        double avgRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        homestay.setNumReviews(numReviews);
        homestay.setRating(avgRating);
        homestayRepository.save(homestay);

        return mapToResponse(savedReview);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .homestayId(review.getHomestay().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
