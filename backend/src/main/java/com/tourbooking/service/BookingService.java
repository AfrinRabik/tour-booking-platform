package com.tourbooking.service;

import com.tourbooking.dto.BookingRequest;
import com.tourbooking.dto.BookingResponse;
import com.tourbooking.entity.Booking;
import com.tourbooking.entity.BookingStatus;
import com.tourbooking.entity.Payment;
import com.tourbooking.entity.TourPackage;
import com.tourbooking.exception.ResourceNotFoundException;
import com.tourbooking.repository.BookingRepository;
import com.tourbooking.repository.PackageRepository;
import com.tourbooking.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PackageRepository packageRepository;
    private final PaymentRepository paymentRepository;

    /**
     * A child seat is priced at half the adult price - a simple, common
     * tour-industry convention. Swap this out for your own pricing rules
     * whenever you plug in a real pricing engine.
     */
    private static final double CHILD_PRICE_MULTIPLIER = 0.5;

    public BookingResponse createBooking(BookingRequest request) {
        TourPackage tourPackage = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Package not found with id: " + request.getPackageId()));

        int adults = request.getAdults();
        int children = request.getChildren() == null ? 0 : request.getChildren();
        double totalAmount = (adults * tourPackage.getPrice())
                + (children * tourPackage.getPrice() * CHILD_PRICE_MULTIPLIER);

        Booking booking = new Booking();
        booking.setCustomerName(request.getCustomerName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setTravelDate(request.getTravelDate());
        booking.setAdults(adults);
        booking.setChildren(children);
        booking.setTourPackage(tourPackage);
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public List<BookingResponse> getBookingsByEmail(String email) {
        return bookingRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(email)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = findBookingOrThrow(id);
        return toResponse(booking);
    }

    public BookingResponse cancelBooking(Long id) {
        Booking booking = findBookingOrThrow(id);

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    // --- helpers ---

    private Booking findBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private BookingResponse toResponse(Booking b) {
        BookingResponse response = new BookingResponse();
        response.setId(b.getId());
        response.setCustomerName(b.getCustomerName());
        response.setEmail(b.getEmail());
        response.setPhone(b.getPhone());
        response.setTravelDate(b.getTravelDate());
        response.setAdults(b.getAdults());
        response.setChildren(b.getChildren());
        response.setPackageId(b.getTourPackage().getId());
        response.setDestination(b.getTourPackage().getDestination());
        response.setPackageImageUrl(b.getTourPackage().getImageUrl());
        response.setTotalAmount(b.getTotalAmount());
        response.setBookingStatus(b.getBookingStatus());
        response.setCreatedAt(b.getCreatedAt());

        Optional<Payment> payment = paymentRepository.findByBookingId(b.getId());
        payment.ifPresent(p -> {
            response.setTransactionId(p.getTransactionId());
            response.setPaymentStatus(p.getPaymentStatus().name());
        });

        return response;
    }
}
