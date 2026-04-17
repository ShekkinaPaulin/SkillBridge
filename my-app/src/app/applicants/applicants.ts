
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, JobApplication, JobPost } from '../job';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css'
})
export class Applicants implements OnInit {
 
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
 
  jobId!: number;
  job: JobPost | null = null;
  applicants: JobApplication[] = [];
  loading = true;
 
  ngOnInit(): void {
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    setTimeout(() => {
      this.loadJob();
      this.loadApplicants();
    }, 100);
  }
 
  loadJob(): void {
    this.jobService.getJobById(this.jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading job', err)
    });
  }
 
  loadApplicants(): void {
    this.jobService.getApplicants(this.jobId).subscribe({
      next: (applicants) => {
        this.applicants = [...applicants];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading applicants', err)
    });
  }
 
  acceptApplicant(applicationId: number): void {
    this.jobService.acceptApplicant(applicationId).subscribe({
      next: () => {
        this.loadApplicants();
        this.loadJob();
      },
      error: (err) => console.error('Error accepting', err)
    });
  }
 
  rejectApplicant(applicationId: number): void {
    this.jobService.rejectApplicant(applicationId).subscribe({
      next: () => {
        this.loadApplicants();
      },
      error: (err) => console.error('Error rejecting', err)
    });
  }
 
  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}