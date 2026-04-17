import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { WorkerComponent } from './worker/worker';
import { Ratings } from './ratings/ratings';
import { Jobs } from './jobs/jobs';
import { Applicants } from './applicants/applicants';
import { SeekerLoginComponent } from './auth/seeker-login/seeker-login';
import { SeekerRegisterComponent } from './auth/seeker-register/seeker-register';
import { WorkerLoginComponent } from './auth/worker-login/worker-login';
import { WorkerRegisterComponent } from './auth/worker-register/worker-register';
import { authGuard, guestGuard } from './guards/auth';
export const routes: Routes = [
  { path: '', redirectTo: 'worker-login', pathMatch: 'full' },

  // guest only — redirect to /home if already logged in
  { path: 'worker-login',    component: WorkerLoginComponent,    canActivate: [guestGuard] },
  { path: 'worker-register', component: WorkerRegisterComponent, canActivate: [guestGuard] },
  { path: 'seeker-login',    component: SeekerLoginComponent,    canActivate: [guestGuard] },
  { path: 'seeker-register', component: SeekerRegisterComponent, canActivate: [guestGuard] },

  // protected — redirect to /worker-login if not logged in
  { path: 'home',    component: HomeComponent,   canActivate: [authGuard] },
  { path: 'workers', component: WorkerComponent, canActivate: [authGuard] },
  { path: 'ratings', component: Ratings,         canActivate: [authGuard] },
  { path: 'jobs',    component: Jobs,            canActivate: [authGuard] },
  { path: 'jobs/:id/applicants', component: Applicants, canActivate: [authGuard] },

  { path: '**', redirectTo: 'worker-login' }
];
