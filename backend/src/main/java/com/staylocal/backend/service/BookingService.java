package com.staylocal.backend.service;

import com.staylocal.backend.dto.BookingRequest;
import com.staylocal.backend.dto.BookingResponse;
import com.staylocal.backend.entity.Booking;
import com.staylocal.backend.entity.Homestay;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.repository.BookingRepository;
import com.staylocal.backend.repository.HomestayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HomestayRepository homestayRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, User tourist) {
        Homestay homestay = homestayRepository.findById(request.getHomestayId())
                .orElseThrow(() -> new RuntimeException("Homestay not found"));

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (days <= 0) {
            throw new RuntimeException("Invalid dates: Check-out must be after check-in");
        }

        BigDecimal totalPrice = homestay.getPrice().multiply(BigDecimal.valueOf(days));

        Booking booking = Booking.builder()
                .homestay(homestay)
                .tourist(tourist)
                .host(homestay.getHost())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .guests(request.getGuests())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(User tourist) {
        return bookingRepository.findByTourist(tourist).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getHostBookings(User host) {
        return bookingRepository.findByHost(host).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Only tourist who booked, the host, or admin can cancel
        if (!booking.getTourist().getId().equals(user.getId()) &&
            !booking.getHost().getId().equals(user.getId()) &&
            !user.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .homestayId(booking.getHomestay().getId())
                .homestayTitle(booking.getHomestay().getTitle())
                .homestayLocation(booking.getHomestay().getLocation())
                .touristId(booking.getTourist().getId())
                .touristName(booking.getTourist().getName())
                .touristEmail(booking.getTourist().getEmail())
                .hostId(booking.getHost().getId())
                .hostName(booking.getHost().getName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .guests(booking.getGuests())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
