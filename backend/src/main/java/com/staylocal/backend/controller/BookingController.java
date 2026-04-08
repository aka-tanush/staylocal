package com.staylocal.backend.controller;

import com.staylocal.backend.dto.BookingRequest;
import com.staylocal.backend.dto.BookingResponse;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request, @AuthenticationPrincipal User tourist) {
        return new ResponseEntity<>(bookingService.createBooking(request, tourist), HttpStatus.CREATED);
    }

    @GetMapping("/mybookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal User tourist) {
        return ResponseEntity.ok(bookingService.getMyBookings(tourist));
    }

    @GetMapping("/host")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<List<BookingResponse>> getHostBookings(@AuthenticationPrincipal User host) {
        return ResponseEntity.ok(bookingService.getHostBookings(host));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id, @AuthenticationPrincipal User user) {
        bookingService.cancelBooking(id, user);
        return ResponseEntity.noContent().build();
    }
}
