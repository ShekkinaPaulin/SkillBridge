package com.example.workerapp.dto;


import lombok.Data;

@Data
public class JobPostDTO {
    private String title;
    private String skillCategory;
    private String location;
    private String pincode;
    private String budget;
    private String postedBy;
    private String phone;
}
