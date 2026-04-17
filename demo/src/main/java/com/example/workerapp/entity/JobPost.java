package com.example.workerapp.entity;

import com.example.workerapp.enums.JobStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_post")
@Data
@NoArgsConstructor
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String skillCategory;
    private String location;
    private String pincode;
    private String budget;
    private String postedBy;
    private String phone;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();
}
