package com.tourbooking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {

    @NotBlank(message = "Name is required")
    private String customerName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Travel date is required")
    @Future(message = "Travel date must be in the future")
    private LocalDate travelDate;

    @NotNull(message = "Package id is required")
    private Long packageId;

    @Min(value = 1, message = "At least 1 adult is required")
    private Integer adults;

    @Min(value = 0, message = "Children cannot be negative")
    private Integer children = 0;
}
