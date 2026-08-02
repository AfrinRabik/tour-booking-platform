package com.tourbooking.service;

import com.tourbooking.dto.PaymentRequest;
import com.tourbooking.dto.PaymentResponse;
import com.tourbooking.entity.Booking;
import com.tourbooking.entity.BookingStatus;
import com.tourbooking.entity.Payment;
import com.tourbooking.entity.PaymentStatus;
import com.tourbooking.exception.ResourceNotFoundException;
import com.tourbooking.repository.BookingRepository;
import com.tourbooking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    /**
     * Simulates a payment gateway call. Swap the body of this method for a real
     * Razorpay/Stripe SDK call later - the rest of the app only depends on this
     * method returning a PaymentResponse, so nothing else needs to change.
     */
    public PaymentResponse processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + request.getBookingId()));

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Cannot pay for a cancelled booking");
        }

        paymentRepository.findByBookingId(booking.getId()).ifPresent(existing -> {
            throw new IllegalStateException("This booking has already been paid for");
        });

        String transactionId = "TXN" + UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 9)
                .toUpperCase();

        // Mock gateway: always succeeds. This is the one line to replace with a
        // real gateway call + webhook/callback handling in production.
        PaymentStatus status = PaymentStatus.SUCCESS;

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setTransactionId(transactionId);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(status);
        Payment savedPayment = paymentRepository.save(payment);

        if (status == PaymentStatus.SUCCESS) {
            booking.setBookingStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }

        return new PaymentResponse(
                booking.getId(),
                savedPayment.getTransactionId(),
                savedPayment.getAmount(),
                savedPayment.getPaymentStatus(),
                booking.getBookingStatus(),
                booking.getTourPackage().getDestination(),
                booking.getTravelDate()
        );
    }
}
