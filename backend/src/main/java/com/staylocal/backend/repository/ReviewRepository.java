package com.staylocal.backend.repository;

import com.staylocal.backend.entity.Homestay;
import com.staylocal.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHomestay(Homestay homestay);
}
