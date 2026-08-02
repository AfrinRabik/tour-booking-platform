package com.tourbooking.repository;

import com.tourbooking.entity.Payment;
import com.tourbooking.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}
