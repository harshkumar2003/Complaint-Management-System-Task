package com.resolvelt.repository;

import com.resolvelt.entity.Complaint;
import com.resolvelt.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

    long countByStatus(ComplaintStatus status);
}
