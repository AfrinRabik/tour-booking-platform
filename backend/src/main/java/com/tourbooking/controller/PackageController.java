package com.tourbooking.controller;

import com.tourbooking.dto.PackageDTO;
import com.tourbooking.service.PackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    // --- Public customer-facing endpoints ---

    @GetMapping("/api/packages")
    public ResponseEntity<List<PackageDTO>> getAllPackages() {
        return ResponseEntity.ok(packageService.getAllPackages());
    }

    @GetMapping("/api/packages/{id}")
    public ResponseEntity<PackageDTO> getPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackageById(id));
    }

    // --- Admin-only endpoints ---
    // NOTE: no auth guard yet - add Spring Security + an ADMIN role check here
    // before deploying this anywhere real.

    @PostMapping("/api/admin/packages")
    public ResponseEntity<PackageDTO> createPackage(@RequestBody PackageDTO dto) {
        PackageDTO created = packageService.createPackage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/api/admin/packages/{id}")
    public ResponseEntity<PackageDTO> updatePackage(@PathVariable Long id, @RequestBody PackageDTO dto) {
        return ResponseEntity.ok(packageService.updatePackage(id, dto));
    }

    @DeleteMapping("/api/admin/packages/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.noContent().build();
    }
}
