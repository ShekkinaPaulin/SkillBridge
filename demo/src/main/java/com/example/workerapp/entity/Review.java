package com.example.workerapp.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String employee;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // Getters and Setters
    public int getId()                       { return id; }
    public String getEmployee()              { return employee; }
    public void setEmployee(String e)        { this.employee = e; }
    public int getRating()                   { return rating; }
    public void setRating(int r)             { this.rating = r; }
    public String getComment()               { return comment; }
    public void setComment(String c)         { this.comment = c; }
    public LocalDateTime getCreatedAt()      { return createdAt; }
}
