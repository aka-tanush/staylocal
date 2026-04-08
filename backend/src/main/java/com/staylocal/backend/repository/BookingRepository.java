package com.staylocal.backend.repository;

import com.staylocal.backend.entity.Booking;
import com.staylocal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTourist(User tourist);
    List<Booking> findByHost(User host);
}
