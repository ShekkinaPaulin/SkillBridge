package com.example.workerapp.service;

import com.example.workerapp.entity.Worker;
import com.example.workerapp.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;

    // Get all workers
    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    // Get worker by ID
    public Optional<Worker> getWorkerById(Long id) {
        return workerRepository.findById(id);
    }

    // Register new worker
    public Worker registerWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    // Update worker
    public Worker updateWorker(Long id, Worker updatedWorker) {
        Worker existing = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found with id: " + id));
        existing.setFullName(updatedWorker.getFullName());
        existing.setEmail(updatedWorker.getEmail());
        existing.setPhone(updatedWorker.getPhone());
        existing.setJobType(updatedWorker.getJobType());
        existing.setExperience(updatedWorker.getExperience());
        existing.setLocation(updatedWorker.getLocation());
        existing.setDescription(updatedWorker.getDescription());
        return workerRepository.save(existing);
    }

    // Delete worker
    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }
}