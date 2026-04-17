import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';          // ✅ add
import { WorkerService } from '../services/worker';
import { Worker } from '../models/worker.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-worker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './worker.html',
  styleUrls: ['./worker.css']
})
export class WorkerComponent implements OnInit {

  workerForm!: FormGroup;
  contactForm!: FormGroup;                          // ✅ add
  workers: Worker[] = [];
  showForm: boolean = false;
  showContactModal = false;                         // ✅ add
  selectedWorker: Worker | null = null;             // ✅ add
  successMessage: string = '';
  errorMessage: string = '';
  contactMsg = '';                                  // ✅ add
  private cdr = inject(ChangeDetectorRef);

  jobTypes = [
    { value: 'plumbing',    label: '🔧 Plumbing'    },
    { value: 'tailoring',   label: '🧵 Tailoring'   },
    { value: 'carpentry',   label: '🪚 Carpentry'   },
    { value: 'electrician', label: '⚡ Electrician'  },
    { value: 'painting',    label: '🎨 Painting'    },
    { value: 'cleaning',    label: '🧹 Cleaning'    },
    { value: 'gardening',   label: '🌱 Gardening'   },
    { value: 'cooking',     label: '👨‍🍳 Cooking'    },
  ];

  private fb            = inject(FormBuilder);
  private workerService = inject(WorkerService);
  private http          = inject(HttpClient);       // ✅ add

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.workerForm = this.fb.group({
      fullName:    ['', [Validators.required, Validators.minLength(3)]],
      email:       ['', [Validators.required, Validators.email]],
      phone:       ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      jobType:     ['', Validators.required],
      experience:  ['', [Validators.required, Validators.min(0)]],
      location:    ['', Validators.required],
      description: ['']
    });

    // ✅ add contact form
    this.contactForm = this.fb.group({
      seekerName:  ['', Validators.required],
      seekerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      message:     ['', Validators.required]
    });

    this.loadWorkers();
  }

  // ── all your existing methods unchanged ──────────────────────────

  loadWorkers(): void {
    this.workerService.getAllWorkers().subscribe({
      next: (data: Worker[]) => {
        this.workers = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error loading workers', err)
    });
  }
  private authService = inject(AuthService);

get userRole(): string | null {
  return this.authService.getRole();
}

  getJobSvgIcon(jobType: string): string {
  const icons: Record<string, string> = {
    cleaning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l4-4m0 0L18 6a2 2 0 0 0-3-3L4 14l3 3z"/><path d="M14 4l6 6"/></svg>`,
    tailoring: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    cooking: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6v-7.13z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>`,
    carpentry: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    electrician: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    plumber: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v1H7a2 2 0 0 0-2 2v3h14V8a2 2 0 0 0-2-2h-2V5a3 3 0 0 0-3-3z"/><rect x="5" y="11" width="14" height="10" rx="2"/></svg>`,
  };
  const key = jobType?.toLowerCase();
  return icons[key] ?? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a3d6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
}

getSafeIcon(jobType: string): SafeHtml {
  const icons: Record<string, string> = {
    cleaning:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l4-4m0 0L18 6a2 2 0 0 0-3-3L4 14l3 3z"/><path d="M14 4l6 6"/></svg>`,
    tailoring:   `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    cooking:     `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6v-7.13z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>`,
    carpentry:   `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    electrician: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    plumber:     `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v1H7a2 2 0 0 0-2 2v3h14V8a2 2 0 0 0-2-2h-2V5a3 3 0 0 0-3-3z"/><rect x="5" y="11" width="14" height="10" rx="2"/></svg>`,
    painting:    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13.5V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6.5"/><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>`,
  };
  const key = jobType?.toLowerCase();
  const svg = icons[key] ?? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0C447C" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

  

  openForm(): void {
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.workerForm.reset();
  }

  closeForm(): void {
    this.showForm = false;
    this.workerForm.reset();
  }

  onSubmit(): void {
    if (this.workerForm.valid) {
      this.workerService.registerWorker(this.workerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Worker registered successfully!';
          this.workerService.getAllWorkers().subscribe({
            next: (data: Worker[]) => {
              this.workers = [...data];
              this.cdr.detectChanges();
              this.closeForm();
            }
          });
        },
        error: () => {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      });
    }
  }

  deleteWorker(id: number): void {
    if (confirm('Are you sure you want to delete this worker?')) {
      this.workerService.deleteWorker(id).subscribe({
        next: () => this.loadWorkers(),
        error: (err: any) => console.error('Error deleting worker', err)
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.workerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getJobIcon(jobType: string): string {
    const icons: Record<string, string> = {
      plumbing: '🔧', tailoring: '🧵', carpentry: '🪚',
      electrician: '⚡', painting: '🎨', cleaning: '🧹',
      gardening: '🌱', cooking: '👨‍🍳'
    };
    return icons[jobType] || '💼';
  }

  getJobColor(jobType: string): string {
    const colors: Record<string, string> = {
      plumbing: 'bg-primary',    tailoring: 'bg-success',
      carpentry: 'bg-warning',   electrician: 'bg-warning',
      painting: 'bg-danger',     cleaning: 'bg-info',
      gardening: 'bg-success',   cooking: 'bg-secondary'
    };
    return colors[jobType] || 'bg-secondary';
  }

  // ✅ new contact methods below ─────────────────────────────────────

  openContact(worker: Worker): void {
    this.selectedWorker = worker;
    this.showContactModal = true;
    this.contactMsg = '';
    this.contactForm.reset();
  }

  closeContact(): void {
    this.showContactModal = false;
    this.selectedWorker = null;
  }

  isContactInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  sendMessage(): void {
    if (this.contactForm.invalid || !this.selectedWorker) return;

    const payload = {
      workerName:  this.selectedWorker.fullName,
      workerPhone: this.selectedWorker.phone,
      ...this.contactForm.value
    };

    this.http.post('http://localhost:3000/api/contact-worker', payload).subscribe({
      next: () => {
        this.contactMsg = 'ok';
        setTimeout(() => this.closeContact(), 2000);
      },
      error: () => {
        this.contactMsg = 'err';
      }
    });
  }
}