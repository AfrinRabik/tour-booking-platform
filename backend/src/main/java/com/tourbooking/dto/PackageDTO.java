package com.tourbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageDTO {
    private Long id;
    private String destination;
    private Double price;
    private String duration;
    private String description;
    private String imageUrl;
    private Double rating;
    private String hotelsIncluded;
    private String transportation;
    private String meals;
    private String touristPlaces;
    private String itinerary;
    private String cancellationPolicy;
}
