package com.tourbooking.service;

import com.tourbooking.dto.PackageDTO;
import com.tourbooking.entity.TourPackage;
import com.tourbooking.exception.ResourceNotFoundException;
import com.tourbooking.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PackageService {

    private final PackageRepository packageRepository;

    public List<PackageDTO> getAllPackages() {
        return packageRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PackageDTO getPackageById(Long id) {
        TourPackage tourPackage = findPackageOrThrow(id);
        return toDTO(tourPackage);
    }

    public PackageDTO createPackage(PackageDTO dto) {
        TourPackage entity = toEntity(dto);
        entity.setId(null); // ensure we always insert, never overwrite
        return toDTO(packageRepository.save(entity));
    }

    public PackageDTO updatePackage(Long id, PackageDTO dto) {
        TourPackage existing = findPackageOrThrow(id);

        existing.setDestination(dto.getDestination());
        existing.setPrice(dto.getPrice());
        existing.setDuration(dto.getDuration());
        existing.setDescription(dto.getDescription());
        existing.setImageUrl(dto.getImageUrl());
        existing.setRating(dto.getRating());
        existing.setHotelsIncluded(dto.getHotelsIncluded());
        existing.setTransportation(dto.getTransportation());
        existing.setMeals(dto.getMeals());
        existing.setTouristPlaces(dto.getTouristPlaces());
        existing.setItinerary(dto.getItinerary());
        existing.setCancellationPolicy(dto.getCancellationPolicy());

        return toDTO(packageRepository.save(existing));
    }

    public void deletePackage(Long id) {
        TourPackage existing = findPackageOrThrow(id);
        packageRepository.delete(existing);
    }

    // --- helpers ---

    private TourPackage findPackageOrThrow(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));
    }

    private PackageDTO toDTO(TourPackage p) {
        return new PackageDTO(
                p.getId(), p.getDestination(), p.getPrice(), p.getDuration(), p.getDescription(),
                p.getImageUrl(), p.getRating(), p.getHotelsIncluded(), p.getTransportation(),
                p.getMeals(), p.getTouristPlaces(), p.getItinerary(), p.getCancellationPolicy()
        );
    }

    private TourPackage toEntity(PackageDTO d) {
        TourPackage p = new TourPackage();
        p.setId(d.getId());
        p.setDestination(d.getDestination());
        p.setPrice(d.getPrice());
        p.setDuration(d.getDuration());
        p.setDescription(d.getDescription());
        p.setImageUrl(d.getImageUrl());
        p.setRating(d.getRating());
        p.setHotelsIncluded(d.getHotelsIncluded());
        p.setTransportation(d.getTransportation());
        p.setMeals(d.getMeals());
        p.setTouristPlaces(d.getTouristPlaces());
        p.setItinerary(d.getItinerary());
        p.setCancellationPolicy(d.getCancellationPolicy());
        return p;
    }
}
