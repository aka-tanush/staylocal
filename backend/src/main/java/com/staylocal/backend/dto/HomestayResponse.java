package com.staylocal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomestayResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private List<String> images;
    private Double rating;
    private Integer numReviews;
    private Long hostId;
    private String hostName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
