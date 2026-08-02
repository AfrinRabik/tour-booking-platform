package com.tourbooking.dto;

import com.tourbooking.entity.BookingStatus;
import com.tourbooking.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long bookingId;
    private String transactionId;
    private Double amount;
    private PaymentStatus paymentStatus;
    private BookingStatus bookingStatus;
    private String destination;
    private LocalDate travelDate;
}
