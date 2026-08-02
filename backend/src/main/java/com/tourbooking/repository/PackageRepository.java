package com.tourbooking.repository;

import com.tourbooking.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageRepository extends JpaRepository<TourPackage, Long> {
}
