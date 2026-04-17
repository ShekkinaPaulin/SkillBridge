package com.example.workerapp.controller;


import com.example.workerapp.dto.ContactRequest;
import com.example.workerapp.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/contact-worker")
    public ResponseEntity<?> contactWorker(@RequestBody ContactRequest req) {
        try {
            System.out.println("Received request: " + req.getWorkerPhone()); // ✅ log input
            smsService.sendSms(
                    req.getWorkerPhone(),
                    req.getWorkerName(),
                    req.getSeekerName(),
                    req.getSeekerPhone(),
                    req.getMessage()
            );
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            e.printStackTrace(); // ✅ prints full error to Spring Boot console
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

}