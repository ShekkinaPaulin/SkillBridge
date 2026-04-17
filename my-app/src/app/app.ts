import { Component, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  isCollapsed = false;  
  showSidebar = false;
  private router = inject(Router);

  private auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/worker-login']);
  }

  // routes where sidebar should be hidden
  private noSidebarRoutes = [
    '/worker-login', '/worker-register',
    '/seeker-login', '/seeker-register'
  ];

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.showSidebar = !this.noSidebarRoutes.includes(e.urlAfterRedirects);
    });
  }
}