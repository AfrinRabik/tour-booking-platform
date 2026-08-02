package com.tourbooking.dto;

import com.tourbooking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String customerName;
    private String email;
    private String phone;
    private LocalDate travelDate;
    private Integer adults;
    private Integer children;
    private Long packageId;
    private String destination;
    private String packageImageUrl;
    private Double totalAmount;
    private BookingStatus bookingStatus;
    private LocalDateTime createdAt;

    // Populated only once a payment exists for this booking, for the "My Bookings" table
    private String transactionId;
    private String paymentStatus;
}
