package com.example.workerapp.service;

import com.example.workerapp.dto.JobApplicationDTO;
import com.example.workerapp.entity.JobApplication;
import com.example.workerapp.entity.JobPost;
import com.example.workerapp.enums.ApplicationStatus;
import com.example.workerapp.enums.JobStatus;
import com.example.workerapp.repository.JobApplicationRepository;
import com.example.workerapp.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostRepository jobPostRepository;

    public JobApplication applyToJob(Long jobId, JobApplicationDTO dto) {
        JobPost job = jobPostRepository.findById(jobId).orElseThrow();
        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setWorkerName(dto.getWorkerName());
        application.setWorkerPhone(dto.getWorkerPhone());
        application.setWorkerSkill(dto.getWorkerSkill());
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getApplicants(Long jobId) {
        try {
            return jobApplicationRepository.findByJobId(jobId);
        } catch (Exception e) {
            e.printStackTrace();  // ✅ force print error
            throw e;
        }
    }

    public JobApplication acceptApplicant(Long applicationId) {
        JobApplication app = jobApplicationRepository
                .findById(applicationId).orElseThrow();
        app.setStatus(ApplicationStatus.ACCEPTED);
        jobApplicationRepository.save(app);
        JobPost job = app.getJob();
        job.setStatus(JobStatus.ACTIVE);
        jobPostRepository.save(job);
        return app;
    }

    public JobApplication rejectApplicant(Long applicationId) {
        JobApplication app = jobApplicationRepository
                .findById(applicationId).orElseThrow();
        app.setStatus(ApplicationStatus.REJECTED);
        return jobApplicationRepository.save(app);
    }

    public long getApplicantCount(Long jobId) {
        return jobApplicationRepository.countByJobId(jobId);
    }
}