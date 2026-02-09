package com.resolvelt.controller;

import com.resolvelt.dto.ComplaintRequest;
import com.resolvelt.entity.Complaint;
import com.resolvelt.service.ComplaintService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // USER: Create complaint
    @PostMapping
    public Complaint createComplaint(@RequestBody ComplaintRequest request) {
        return complaintService.createComplaint(request);
    }

    // USER: Get own complaints (userId is LONG)
    @GetMapping("/user/{userId}")
    public List<Complaint> getUserComplaints(@PathVariable Long userId) {
        return complaintService.getComplaintsByUser(userId);
    }

    // INTERNAL / ADMIN
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }
}
