package com.example.workerapp.controller;

import com.example.workerapp.entity.Worker;
import com.example.workerapp.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    // GET all workers
    // URL: GET http://localhost:8080/api/workers
    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    // GET worker by ID
    // URL: GET http://localhost:8080/api/workers/1
    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable Long id) {
        return workerService.getWorkerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST register worker
    // URL: POST http://localhost:8080/api/workers
    @PostMapping
    public ResponseEntity<Worker> registerWorker(@RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.registerWorker(worker));
    }

    // PUT update worker
    // URL: PUT http://localhost:8080/api/workers/1
    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable Long id,
                                               @RequestBody Worker worker) {
        return ResponseEntity.ok(workerService.updateWorker(id, worker));
    }

    // DELETE worker
    // URL: DELETE http://localhost:8080/api/workers/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.ok("Worker deleted successfully");
    }
}