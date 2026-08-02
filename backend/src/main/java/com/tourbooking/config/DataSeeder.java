package com.tourbooking.config;

import com.tourbooking.entity.TourPackage;
import com.tourbooking.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds sample tour packages on first startup only. Runs every time the app
 * starts, but checks count() == 0 first - so redeploying or restarting on
 * Render never creates duplicate rows against the persistent Postgres DB.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final PackageRepository packageRepository;

    @Override
    public void run(String... args) {
        if (packageRepository.count() > 0) {
            return;
        }

        packageRepository.saveAll(List.of(
            pkg("Goa Beach Tour", 14999.0, "4 Days / 3 Nights",
                "Sun, sand and nightlife along India's favourite coastline.",
                "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", 4.5,
                "3-star beach resort, sea-facing rooms", "AC coach + private taxi transfers",
                "Breakfast and dinner daily", "Baga Beach, Fort Aguada, Anjuna Flea Market, Dudhsagar Falls",
                "Day 1: Arrival and Baga Beach | Day 2: Fort Aguada and Anjuna Market | Day 3: Dudhsagar Falls day trip | Day 4: Departure",
                "Free cancellation up to 7 days before travel. 50% refund within 3-7 days. No refund within 48 hours."),

            pkg("Kerala Backwaters", 21999.0, "5 Days / 4 Nights",
                "Houseboats, palm groves and misty tea plantations.",
                "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800", 4.8,
                "Houseboat stay + hill resort", "Private car with driver",
                "All meals included", "Alleppey Backwaters, Munnar Tea Gardens, Periyar Wildlife Sanctuary",
                "Day 1: Kochi arrival | Day 2-3: Alleppey houseboat | Day 4: Munnar tea gardens | Day 5: Departure",
                "Free cancellation up to 10 days before travel. 50% refund within 4-10 days. No refund within 72 hours."),

            pkg("Himachal Adventure", 18499.0, "6 Days / 5 Nights",
                "Mountain trails, river rafting and pine-scented air.",
                "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800", 4.6,
                "3-star mountain lodges", "AC coach",
                "Breakfast and dinner daily", "Manali, Solang Valley, Rohtang Pass, Old Manali",
                "Day 1: Delhi to Manali | Day 2: Solang Valley | Day 3: Rohtang Pass | Day 4: River rafting | Day 5: Old Manali | Day 6: Departure",
                "Free cancellation up to 7 days before travel. 50% refund within 3-7 days. No refund within 48 hours."),

            pkg("Rajasthan Royal Trail", 25999.0, "7 Days / 6 Nights",
                "Forts, palaces and desert sunsets across the Land of Kings.",
                "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", 4.7,
                "Heritage hotels and palace stays", "AC coach + camel safari",
                "Breakfast daily, dinner on 4 nights", "Jaipur City Palace, Jodhpur Mehrangarh Fort, Jaisalmer Desert, Udaipur Lake Palace",
                "Day 1-2: Jaipur | Day 3-4: Jodhpur | Day 5: Jaisalmer desert camp | Day 6-7: Udaipur and departure",
                "Free cancellation up to 14 days before travel. 50% refund within 5-14 days. No refund within 5 days."),

            pkg("Andaman Island Escape", 32999.0, "5 Days / 4 Nights",
                "Turquoise waters, coral reefs and untouched islands.",
                "https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=800", 4.9,
                "Beachfront resort", "Ferry transfers + private cab",
                "Breakfast and dinner daily", "Radhanagar Beach, Cellular Jail, Havelock Island, Neil Island",
                "Day 1: Port Blair arrival | Day 2: Cellular Jail | Day 3: Havelock Island | Day 4: Neil Island | Day 5: Departure",
                "Free cancellation up to 10 days before travel. 50% refund within 5-10 days. No refund within 5 days."),

            pkg("Ladakh Bike Expedition", 28999.0, "8 Days / 7 Nights",
                "High-altitude passes and monasteries above the clouds.",
                "https://images.unsplash.com/photo-1626015449351-3d885a2d5ce6?w=800", 4.4,
                "Guesthouses and camps", "Royal Enfield rental + support vehicle",
                "All meals included", "Pangong Lake, Nubra Valley, Khardung La, Leh Palace",
                "Day 1-2: Leh acclimatisation | Day 3: Khardung La to Nubra | Day 4-5: Pangong Lake | Day 6-7: Leh sightseeing | Day 8: Departure",
                "Free cancellation up to 15 days before travel. 40% refund within 7-15 days. No refund within 7 days.")
        ));
    }

    private TourPackage pkg(String destination, Double price, String duration, String description,
                             String imageUrl, Double rating, String hotels, String transport,
                             String meals, String places, String itinerary, String cancellation) {
        TourPackage p = new TourPackage();
        p.setDestination(destination);
        p.setPrice(price);
        p.setDuration(duration);
        p.setDescription(description);
        p.setImageUrl(imageUrl);
        p.setRating(rating);
        p.setHotelsIncluded(hotels);
        p.setTransportation(transport);
        p.setMeals(meals);
        p.setTouristPlaces(places);
        p.setItinerary(itinerary);
        p.setCancellationPolicy(cancellation);
        return p;
    }
}
