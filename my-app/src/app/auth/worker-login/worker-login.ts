import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './worker-login.html',
  styleUrl: './worker-login.css'
})
export class WorkerLoginComponent {
  form = { email: '', password: '' };
  error = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.auth.login({ ...this.form, role: 'WORKER' }).subscribe({
      next: (res: any) => {
        this.auth.saveSession(res.token, res.role, res.name);
        this.router.navigate(['/home']);
      },
      error: () => this.error = 'Invalid email or password'
    });
  }
}