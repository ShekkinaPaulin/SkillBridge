import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private base = 'http://localhost:3000/api/auth';
  private platformId = inject(PLATFORM_ID);  // ✅

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
  // ✅ only send email and password
  return this.http.post(`${this.base}/login`, {
    email: data.email,
    password: data.password
  });
}

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/register`, data);
  }

  saveSession(token: string, role: string, name: string): void {
    if (isPlatformBrowser(this.platformId)) {  // ✅
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;  // ✅
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;  // ✅
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;  // ✅
    return !!localStorage.getItem('token');
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {  // ✅
      localStorage.clear();
    }
  }
}