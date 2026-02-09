package com.resolvelt.service;

import com.resolvelt.dto.DashboardResponse;
import com.resolvelt.entity.Complaint;
import com.resolvelt.enums.ComplaintStatus;
import com.resolvelt.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;   // ✅ IMPORTANT

@Service
public class AdminService {

    private final ComplaintRepository complaintRepository;

    public AdminService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // ✅ UUID BASED
    public Complaint updateStatus(UUID id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                complaintRepository.countByStatus(ComplaintStatus.OPEN),
                complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS),
                complaintRepository.countByStatus(ComplaintStatus.RESOLVED)
        );
    }
}
