package com.resolvelt.controller;

import com.resolvelt.dto.DashboardResponse;
import com.resolvelt.dto.StatusUpdateRequest;
import com.resolvelt.entity.Complaint;
import com.resolvelt.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return adminService.getAllComplaints();
    }

    // ✅ UUID FIX HERE
    @PutMapping("/complaints/{id}/status")
    public Complaint updateStatus(
            @PathVariable UUID id,
            @RequestBody StatusUpdateRequest request) {

        return adminService.updateStatus(id, request.getStatus());
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return adminService.getDashboard();
    }
}
