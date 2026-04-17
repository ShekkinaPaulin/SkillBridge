package com.example.workerapp.service;

import com.example.workerapp.dto.JobPostDTO;
import com.example.workerapp.entity.JobPost;
import com.example.workerapp.enums.JobStatus;
import com.example.workerapp.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobPostService {

    private final JobPostRepository jobPostRepository;

    public List<JobPost> getAllJobs() {
        return jobPostRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<JobPost> getJobsByStatus(JobStatus status) {
        return jobPostRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", jobPostRepository.count());
        stats.put("open", jobPostRepository.countByStatus(JobStatus.OPEN));
        stats.put("active", jobPostRepository.countByStatus(JobStatus.ACTIVE));
        stats.put("done", jobPostRepository.countByStatus(JobStatus.DONE));
        return stats;
    }

    public JobPost createJob(JobPostDTO dto) {
        JobPost job = new JobPost();
        job.setTitle(dto.getTitle());
        job.setSkillCategory(dto.getSkillCategory());
        job.setLocation(dto.getLocation());
        job.setPincode(dto.getPincode());
        job.setBudget(dto.getBudget());
        job.setPostedBy(dto.getPostedBy());
        job.setPhone(dto.getPhone());
        return jobPostRepository.save(job);
    }

    public JobPost updateStatus(Long id, JobStatus status) {
        JobPost job = jobPostRepository.findById(id).orElseThrow();
        job.setStatus(status);
        return jobPostRepository.save(job);
    }
    public JobPost getJobById(Long id) {
        return jobPostRepository.findById(id).orElseThrow();
    }
}
