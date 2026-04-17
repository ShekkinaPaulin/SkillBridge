import { Component, OnInit, inject, ChangeDetectorRef,PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService, JobPost, JobApplication } from '../job';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css'
})
export class Jobs implements OnInit,OnDestroy {
  ngOnDestroy(): void {}
 
  private jobService = inject(JobService);
  private cdr = inject(ChangeDetectorRef);
 private router = inject(Router);
   private platformId = inject(PLATFORM_ID);
   
  jobs: JobPost[] = [];
  filteredJobs: JobPost[] = [];
  activeFilter = 'ALL';
  filters = ['ALL', 'OPEN', 'ACTIVE', 'DONE'];
 
  stats = { total: 0, open: 0, active: 0, done: 0 };
 
  showPostForm = false;
  showApplyForm = false;
  showApplicants = false;
 
  selectedJobId: number | null = null;
  applicants: JobApplication[] = [];
 
  postForm = {
    title: '',
    skillCategory: '',
    location: '',
    pincode: '',
    budget: '',
    postedBy: '',
    phone: ''
  };
 
  applyForm = {
    workerName: '',
    workerPhone: '',
    workerSkill: ''
  };
 
  categories = [
    'Plumber', 'Electrician', 'Tailor',
    'Cook', 'Tutor', 'Carpenter',
    'Painter', 'Other'
  ];
 
  postLoading = false;
  applyLoading = false;
  postError = '';
  applyError = '';

  private authService = inject(AuthService);

get userRole(): string | null {
  return this.authService.getRole();
}

 
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {  // ✅ only run in browser
      this.loadJobs();
      this.loadStats();
    }
  }

 
  loadJobs(): void {
    this.jobService.getAllJobs().subscribe({
      next: (jobs) => {
        this.jobs = [...jobs];
        this.applyFilter(this.activeFilter);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading jobs', err)
    });
  }
 
  loadStats(): void {
    this.jobService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading stats', err)
    });
  }
 
  applyFilter(status: string): void {
    this.activeFilter = status;
    this.filteredJobs = status === 'ALL'
      ? [...this.jobs]
      : this.jobs.filter(j => j.status === status);
    this.cdr.detectChanges();
  }
 
  openPostForm(): void {
    this.showPostForm = true;
    this.showApplyForm = false;
    this.showApplicants = false;
  }
 
  openApplyForm(jobId: number): void {
    this.selectedJobId = jobId;
    this.showApplyForm = true;
    this.showPostForm = false;
    this.showApplicants = false;
  }
 
  // openApplicants(jobId: number): void {
  //   this.selectedJobId = jobId;
  //   this.showApplicants = true;
  //   this.showPostForm = false;
  //   this.showApplyForm = false;
  //   this.loadApplicants(jobId);
  // }
  openApplicants(jobId: number): void {
  this.router.navigate(['/jobs', jobId, 'applicants']);
   }
 
  loadApplicants(jobId: number): void {
    this.jobService.getApplicants(jobId).subscribe({
      next: (applicants) => {
        this.applicants = [...applicants];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading applicants', err)
    });
  }
 
  submitJob(): void {
    if (!this.postForm.title || !this.postForm.skillCategory ||
        !this.postForm.location || !this.postForm.pincode ||
        !this.postForm.budget || !this.postForm.postedBy ||
        !this.postForm.phone) {
      this.postError = 'Please fill all fields!';
      return;
    }
    this.postLoading = true;
    this.postError = '';
    this.jobService.createJob(this.postForm).subscribe({
      next: () => {
        this.postLoading = false;
        this.showPostForm = false;
        this.postForm = {
          title: '', skillCategory: '', location: '',
          pincode: '', budget: '', postedBy: '', phone: ''
        };
        this.loadJobs();
        this.loadStats();
      },
      error: () => {
        this.postLoading = false;
        this.postError = 'Something went wrong!';
      }
    });
  }
 
  submitApply(): void {
    if (!this.applyForm.workerName || !this.applyForm.workerPhone ||
        !this.applyForm.workerSkill) {
      this.applyError = 'Please fill all fields!';
      return;
    }
    this.applyLoading = true;
    this.applyError = '';
    this.jobService.applyToJob(this.selectedJobId!, this.applyForm).subscribe({
      next: () => {
        this.applyLoading = false;
        this.showApplyForm = false;
        this.applyForm = { workerName: '', workerPhone: '', workerSkill: '' };
        alert('Application submitted successfully!');
      },
      error: () => {
        this.applyLoading = false;
        this.applyError = 'Something went wrong!';
      }
    });
  }
 
  acceptApplicant(applicationId: number): void {
    this.jobService.acceptApplicant(applicationId).subscribe({
      next: () => {
        this.loadApplicants(this.selectedJobId!);
        this.loadJobs();
        this.loadStats();
      },
      error: (err) => console.error('Error accepting', err)
    });
  }
 
  rejectApplicant(applicationId: number): void {
    this.jobService.rejectApplicant(applicationId).subscribe({
      next: () => {
        this.loadApplicants(this.selectedJobId!);
      },
      error: (err) => console.error('Error rejecting', err)
    });
  }
 
  updateStatus(id: number, status: string): void {
    this.jobService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadJobs();
        this.loadStats();
      },
      error: (err) => console.error('Error updating status', err)
    });
  }
 
  closeAll(): void {
    this.showPostForm = false;
    this.showApplyForm = false;
    this.showApplicants = false;
  }
}