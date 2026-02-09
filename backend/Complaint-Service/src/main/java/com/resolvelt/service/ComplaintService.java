package com.resolvelt.service;

import com.resolvelt.dto.ComplaintRequest;
import com.resolvelt.entity.Complaint;
import com.resolvelt.enums.ComplaintStatus;
import com.resolvelt.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    // CREATE complaint
    public Complaint createComplaint(ComplaintRequest request) {
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setUserId(request.getUserId());
        complaint.setStatus(ComplaintStatus.OPEN);
        complaint.setCreatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    // 🔥 GET complaints by USER ID (THIS WAS MISSING)
    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    // GET complaint by COMPLAINT ID (UUID)
    public Complaint getComplaint(UUID id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    // GET all complaints (admin/internal)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
}
