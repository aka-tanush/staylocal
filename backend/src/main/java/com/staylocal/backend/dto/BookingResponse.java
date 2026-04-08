package com.staylocal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long homestayId;
    private String homestayTitle;
    private String homestayLocation;
    private Long touristId;
    private String touristName;
    private String touristEmail;
    private Long hostId;
    private String hostName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer guests;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
}
