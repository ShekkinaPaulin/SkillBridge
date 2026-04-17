package com.example.workerapp.controller;

import com.example.workerapp.dto.JobApplicationDTO;
import com.example.workerapp.dto.JobPostDTO;
import com.example.workerapp.entity.JobApplication;
import com.example.workerapp.entity.JobPost;
import com.example.workerapp.enums.JobStatus;
import com.example.workerapp.service.JobApplicationService;
import com.example.workerapp.service.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class JobController {

    private final JobPostService jobPostService;
    private final JobApplicationService jobApplicationService;

    // Get all jobs
    @GetMapping("/jobs")
    public ResponseEntity<List<JobPost>> getAllJobs(
            @RequestParam(required = false) JobStatus status) {
        if (status != null) {
            return ResponseEntity.ok(jobPostService.getJobsByStatus(status));
        }
        return ResponseEntity.ok(jobPostService.getAllJobs());
    }

    // Get stats
    @GetMapping("/jobs/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(jobPostService.getStats());
    }

    // Post a job
    @PostMapping("/jobs")
    public ResponseEntity<JobPost> createJob(@RequestBody JobPostDTO dto) {
        return ResponseEntity.ok(jobPostService.createJob(dto));
    }

    // Update job status
    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<JobPost> updateStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status) {
        return ResponseEntity.ok(jobPostService.updateStatus(id, status));
    }

    // Apply to a job
    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<JobApplication> applyToJob(
            @PathVariable Long jobId,
            @RequestBody JobApplicationDTO dto) {
        return ResponseEntity.ok(
                jobApplicationService.applyToJob(jobId, dto)
        );
    }

    // Get applicants for a job
    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<?> getApplicants(@PathVariable Long jobId) {
        try {
            List<JobApplication> applicants = jobApplicationService.getApplicants(jobId);
            return ResponseEntity.ok(applicants);
        } catch (Exception e) {
            e.printStackTrace();  // ✅ this will print in Spring Boot terminal
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // Accept applicant
    @PatchMapping("/applications/{id}/accept")
    public ResponseEntity<JobApplication> acceptApplicant(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                jobApplicationService.acceptApplicant(id)
        );
    }

    // Reject applicant
    @PatchMapping("/applications/{id}/reject")
    public ResponseEntity<JobApplication> rejectApplicant(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                jobApplicationService.rejectApplicant(id)
        );
    }

    // Get applicant count for a job
    @GetMapping("/jobs/{jobId}/applicants/count")
    public ResponseEntity<Long> getApplicantCount(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(
                jobApplicationService.getApplicantCount(jobId)
        );
    }
    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobPost> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPostService.getJobById(id));
    }
}