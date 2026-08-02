package com.tourbooking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Named TourPackage (not "Package") to avoid clashing with java.lang.Package
 * and because "package" is effectively a reserved word in most SQL dialects.
 */
@Entity
@Table(name = "tour_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private Double price;

    /** e.g. "4 Days / 3 Nights" */
    @Column(nullable = false)
    private String duration;

    @Column(length = 2000)
    private String description;

    private String imageUrl;

    private Double rating;

    @Column(length = 3000)
    private String hotelsIncluded;

    @Column(length = 3000)
    private String transportation;

    @Column(length = 3000)
    private String meals;

    @Column(length = 3000)
    private String touristPlaces;

    @Column(length = 4000)
    private String itinerary;

    @Column(length = 2000)
    private String cancellationPolicy;
}
