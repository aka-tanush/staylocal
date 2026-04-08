package com.staylocal.backend.repository;

import com.staylocal.backend.entity.Homestay;
import com.staylocal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomestayRepository extends JpaRepository<Homestay, Long> {
    List<Homestay> findByHost(User host);
    List<Homestay> findByLocationContainingIgnoreCase(String location);
}
