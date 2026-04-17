import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seeker-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './seeker-register.html',
  styleUrl: './seeker-register.css'
})
export class SeekerRegisterComponent {
  form = { name: '', email: '', password: '' };
  error = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    this.auth.register({ ...this.form, role: 'SEEKER' }).subscribe({
      next: (res: any) => {
        this.auth.saveSession(res.token, res.role, res.name);
        this.router.navigate(['/home']);
      },
      error: () => this.error = 'Registration failed. Try again.'
    });
  }
}