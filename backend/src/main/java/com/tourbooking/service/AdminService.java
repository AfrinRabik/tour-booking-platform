package com.tourbooking.service;

import com.tourbooking.dto.DashboardResponse;
import com.tourbooking.entity.Booking;
import com.tourbooking.entity.BookingStatus;
import com.tourbooking.entity.Payment;
import com.tourbooking.entity.PaymentStatus;
import com.tourbooking.repository.BookingRepository;
import com.tourbooking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public DashboardResponse getDashboard() {
        List<Booking> allBookings = bookingRepository.findAll();

        long total = allBookings.size();
        long confirmed = allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).count();
        long pending = allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.PENDING).count();
        long cancelled = allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED).count();

        List<Payment> successfulPayments = paymentRepository.findByPaymentStatus(PaymentStatus.SUCCESS);
        double revenue = successfulPayments.stream().mapToDouble(Payment::getAmount).sum();

        Map<String, Long> breakdown = paymentRepository.findAll().stream()
                .collect(Collectors.groupingBy(p -> p.getPaymentStatus().name(), Collectors.counting()));

        return new DashboardResponse(total, confirmed, pending, cancelled, revenue, breakdown);
    }
}
