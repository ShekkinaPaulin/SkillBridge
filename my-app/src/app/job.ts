import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JobPost {
  id: number;
  title: string;
  skillCategory: string;
  location: string;
  pincode: string;
  budget: string;
  postedBy: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface JobApplication {
  id: number;
  workerName: string;
  workerPhone: string;
  workerSkill: string;
  status: string;
  appliedAt: string;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private base = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  getAllJobs(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.base}/jobs`);
  }
  getJobById(id: number): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.base}/jobs/${id}`);
  }
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/jobs/stats`);
  }
  createJob(data: any): Observable<JobPost> {
    return this.http.post<JobPost>(`${this.base}/jobs`, data);
  }
  updateStatus(id: number, status: string): Observable<JobPost> {
    return this.http.patch<JobPost>(`${this.base}/jobs/${id}/status?status=${status}`, {});
  }
  applyToJob(jobId: number, data: any): Observable<JobApplication> {
    return this.http.post<JobApplication>(`${this.base}/jobs/${jobId}/apply`, data);
  }
  getApplicants(jobId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.base}/jobs/${jobId}/applicants`);
  }
  acceptApplicant(applicationId: number): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.base}/applications/${applicationId}/accept`, {});
  }
  rejectApplicant(applicationId: number): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.base}/applications/${applicationId}/reject`, {});
  }
}