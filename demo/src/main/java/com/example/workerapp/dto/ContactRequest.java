package com.example.workerapp.dto;


public class ContactRequest {
    private String workerName;
    private String workerPhone;
    private String seekerName;
    private String seekerPhone;
    private String message;

    public String getWorkerName()   { return workerName; }
    public String getWorkerPhone()  { return workerPhone; }
    public String getSeekerName()   { return seekerName; }
    public String getSeekerPhone()  { return seekerPhone; }
    public String getMessage()      { return message; }

    public void setWorkerName(String workerName)    { this.workerName = workerName; }
    public void setWorkerPhone(String workerPhone)  { this.workerPhone = workerPhone; }
    public void setSeekerName(String seekerName)    { this.seekerName = seekerName; }
    public void setSeekerPhone(String seekerPhone)  { this.seekerPhone = seekerPhone; }
    public void setMessage(String message)          { this.message = message; }
}
