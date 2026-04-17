package com.example.workerapp.repository;

import com.example.workerapp.entity.JobPost;
import com.example.workerapp.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {

    List<JobPost> findAllByOrderByCreatedAtDesc();

    List<JobPost> findByStatusOrderByCreatedAtDesc(JobStatus status);

    long countByStatus(JobStatus status);
}
