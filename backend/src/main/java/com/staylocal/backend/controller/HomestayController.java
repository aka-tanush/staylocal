package com.staylocal.backend.controller;

import com.staylocal.backend.dto.HomestayRequest;
import com.staylocal.backend.dto.HomestayResponse;
import com.staylocal.backend.entity.User;
import com.staylocal.backend.service.HomestayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homestays")
@RequiredArgsConstructor
public class HomestayController {

    private final HomestayService homestayService;

    @GetMapping
    public ResponseEntity<List<HomestayResponse>> getAllHomestays(@RequestParam(required = false) String location) {
        return ResponseEntity.ok(homestayService.getAllHomestays(location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HomestayResponse> getHomestayById(@PathVariable Long id) {
        return ResponseEntity.ok(homestayService.getHomestayById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<HomestayResponse> createHomestay(@Valid @RequestBody HomestayRequest request, @AuthenticationPrincipal User host) {
        return new ResponseEntity<>(homestayService.createHomestay(request, host), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<HomestayResponse> updateHomestay(@PathVariable Long id, @Valid @RequestBody HomestayRequest request, @AuthenticationPrincipal User host) {
        return ResponseEntity.ok(homestayService.updateHomestay(id, request, host));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<Void> deleteHomestay(@PathVariable Long id, @AuthenticationPrincipal User host) {
        homestayService.deleteHomestay(id, host);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/host/mylisted")
    @PreAuthorize("hasAnyRole('HOST', 'ADMIN')")
    public ResponseEntity<List<HomestayResponse>> getHostHomestays(@AuthenticationPrincipal User host) {
        return ResponseEntity.ok(homestayService.getHostHomestays(host));
    }
}
