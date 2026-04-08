package com.staylocal.backend.service;

import com.staylocal.backend.dto.HomestayRequest;
import com.staylocal.backend.dto.HomestayResponse;
import com.staylocal.backend.entity.Homestay;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.repository.HomestayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomestayService {

    private final HomestayRepository homestayRepository;

    public List<HomestayResponse> getAllHomestays(String location) {
        List<Homestay> homestays;
        if (location != null && !location.isEmpty()) {
            homestays = homestayRepository.findByLocationContainingIgnoreCase(location);
        } else {
            homestays = homestayRepository.findAll();
        }
        return homestays.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public HomestayResponse getHomestayById(Long id) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Homestay not found"));
        return mapToResponse(homestay);
    }

    @Transactional
    public HomestayResponse createHomestay(HomestayRequest request, User host) {
        Homestay homestay = Homestay.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .location(request.getLocation())
                .images(request.getImages())
                .host(host)
                .build();
        
        Homestay savedHomestay = homestayRepository.save(homestay);
        return mapToResponse(savedHomestay);
    }

    @Transactional
    public HomestayResponse updateHomestay(Long id, HomestayRequest request, User host) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Homestay not found"));

        if (!homestay.getHost().getId().equals(host.getId()) && !host.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Not authorized to update this homestay");
        }

        homestay.setTitle(request.getTitle());
        homestay.setDescription(request.getDescription());
        homestay.setPrice(request.getPrice());
        homestay.setLocation(request.getLocation());
        if (request.getImages() != null) {
            homestay.setImages(request.getImages());
        }

        Homestay updatedHomestay = homestayRepository.save(homestay);
        return mapToResponse(updatedHomestay);
    }

    @Transactional
    public void deleteHomestay(Long id, User host) {
        Homestay homestay = homestayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Homestay not found"));

        if (!homestay.getHost().getId().equals(host.getId()) && !host.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Not authorized to delete this homestay");
        }

        homestayRepository.delete(homestay);
    }

    public List<HomestayResponse> getHostHomestays(User host) {
        return homestayRepository.findByHost(host).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private HomestayResponse mapToResponse(Homestay homestay) {
        return HomestayResponse.builder()
                .id(homestay.getId())
                .title(homestay.getTitle())
                .description(homestay.getDescription())
                .price(homestay.getPrice())
                .location(homestay.getLocation())
                .images(homestay.getImages())
                .rating(homestay.getRating())
                .numReviews(homestay.getNumReviews())
                .hostId(homestay.getHost().getId())
                .hostName(homestay.getHost().getName())
                .createdAt(homestay.getCreatedAt())
                .updatedAt(homestay.getUpdatedAt())
                .build();
    }
}
