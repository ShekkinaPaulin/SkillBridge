package com.example.workerapp.controller;


import com.example.workerapp.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Repository
interface ReviewRepo extends JpaRepository<Review, Integer> {
    List<Review> findByEmployee(String employee);
}

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

    private final ReviewRepo repo;

    public ReviewController(ReviewRepo repo) { this.repo = repo; }

    // Get all reviews
    @GetMapping
    public List<Review> getAll() {
        return repo.findAll();
    }

    // Get reviews by employee name
    @GetMapping("/{employee}")
    public List<Review> getByEmployee(@PathVariable String employee) {
        return repo.findByEmployee(employee);
    }

    // Submit a review
    @PostMapping
    public Review submit(@RequestBody Review review) {
        return repo.save(review);
    }

    // Delete a review
    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        repo.deleteById(id);
        return "Deleted";
    }
}

