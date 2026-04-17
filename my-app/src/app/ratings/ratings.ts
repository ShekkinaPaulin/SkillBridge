import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app">
      <div class="wrap">

        <div class="page-title">
          Employee reviews
          <span class="pill">{{ reviews.length }} reviews</span>
        </div>

        <div class="card" *ngIf="userRole === 'SEEKER' ">
          <div class="card-label">Submit a review</div>

          <div class="field">
            <label>Employee name</label>
            <input [(ngModel)]="form.employee" placeholder="Enter employee name" />
          </div>

          <div class="field">
            <label>Rating</label>
            <div class="stars-row">
              <span *ngFor="let s of [1,2,3,4,5]"
                    class="star"
                    [class.on]="s <= (hovered || form.rating)"
                    (mouseenter)="hovered = s"
                    (mouseleave)="hovered = 0"
                    (click)="form.rating = s">★</span>
            </div>
          </div>

          <div class="field">
            <label>Comment</label>
            <textarea [(ngModel)]="form.comment" placeholder="Write your review..." rows="3"></textarea>
          </div>

          <button class="btn-primary" (click)="submit()">Submit review</button>
          <div class="msg ok"  *ngIf="msg === 'ok'">Review submitted successfully.</div>
          <div class="msg err" *ngIf="msg === 'err'">Could not submit — is the backend running on port 8081?</div>
          <div class="msg val" *ngIf="msg === 'val'">Please fill in the name and select a rating.</div>
        </div>

        <div class="search-row">
          <input [(ngModel)]="search" placeholder="Search by employee name..." />
          <button class="btn-sm" (click)="load()">Search</button>
          <button class="btn-sm" (click)="search=''; load()">Show all</button>
        </div>

        <div class="review-card" *ngFor="let r of reviews">
          <div class="review-top">
            <div class="avatar">{{ initials(r.employee) }}</div>
            <div>
              <div class="emp-name">{{ r.employee }}</div>
              <div class="stars-sm">
                <span *ngFor="let s of [1,2,3,4,5]"
                      [style.color]="s <= r.rating ? '#ffa726' : '#e0e2ee'">★</span>
              </div>
            </div>
            <div class="review-date">{{ r.createdAt | date:'mediumDate' }}</div>
          </div>
          <hr class="divider" />
          <p class="review-comment">{{ r.comment }}</p>
          <button class="btn-del" (click)="delete(r.id)">Delete</button>
        </div>

        <p class="empty" *ngIf="reviews.length === 0">No reviews yet.</p>

      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .app { background: #f4f5f9; min-height: 100vh; padding: 28px 16px; }
    .wrap { max-width: 520px; margin: 0 auto; font-family: sans-serif; }

    .page-title { font-size: 18px; font-weight: 500; color: #1a1f36; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .pill { background: #eef0fb; color: #3949ab; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; letter-spacing: .03em; }

    .card { background: #fff; border: 1px solid #e8eaf0; border-top: 3px solid #1a1f36; border-radius: 12px; padding: 20px; margin-bottom: 14px; }
    .card-label { font-size: 11px; font-weight: 500; color: #1a1f36; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 14px; }

    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; color: #1a1f36; font-weight:strong; margin-bottom: 6px; font-weight: 500; }
    .field input, .field textarea { width: 100%; padding: 9px 12px; background: #fff; border: 1px solid #e8eaf0; border-radius: 8px; font-size: 14px; color: #1a1f36; outline: none; font-family: inherit; transition: border-color .15s; }
    .field input:focus, .field textarea:focus { border-color: #3949ab; box-shadow: 0 0 0 3px rgba(57,73,171,.08); }
    .field textarea { resize: vertical; line-height: 1.5; }

    .stars-row { display: flex; gap: 6px; padding: 2px 0; }
    .star { font-size: 24px; cursor: pointer; color: #e0e2ee; transition: color .1s; line-height: 1; user-select: none; }
    .star.on { color: #ffa726; }

    .btn-primary { background: #1a1f36; color: #fff; border: none; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; letter-spacing: .02em; transition: background .15s; }
    .btn-primary:hover { background: #2e3b96; }
    .btn-sm { background: #fff; color: #6b74a8; border: 1px solid #e0e2ee; padding: 8px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; transition: all .15s; }
    .btn-sm:hover { background: #f4f5f9; border-color: #c5cae9; }

    .msg { font-size: 12px; margin-top: 10px; padding: 8px 12px; border-radius: 6px; font-weight: 500; }
    .msg.ok  { background: #e8f5e9; color: #2e7d32; }
    .msg.err { background: #ffebee; color: #c62828; }
    .msg.val { background: #fff8e1; color: #e65100; }

    .search-row { display: flex; gap: 8px; margin-bottom: 14px; }
    .search-row input { flex: 1; padding: 9px 12px; background: #fff; border: 1px solid #e0e2ee; border-radius: 8px; font-size: 14px; color: #1a1f36; outline: none; font-family: inherit; }
    .search-row input:focus { border-color: #3949ab; box-shadow: 0 0 0 3px rgba(57,73,171,.08); }

    .review-card { background: #fff; border: 1px solid #e8eaf0; border-left: 3px solid #1a1f36; border-radius: 12px; padding: 16px; margin-bottom: 10px; }
    .review-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; background: #eef0fb; color: #3949ab; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .emp-name { font-size: 14px; font-weight: 500; color: #1a1f36; }
    .stars-sm span { font-size: 13px; }
    .review-date { font-size: 12px; color: #9fa8da; margin-left: auto; }
    .divider { border: none; border-top: 1px solid #f0f1f7; margin: 4px 0 10px; }
    .review-comment { font-size: 13px; color: #6b74a8; line-height: 1.6; margin-bottom: 10px; }
    .btn-del { background: transparent; color: #c5cae9; border: 1px solid #e8eaf0; padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all .15s; }
    .btn-del:hover { background: #ffebee; color: #e53935; border-color: #ffcdd2; }
    .empty { color: #c5cae9; font-size: 13px; text-align: center; padding: 20px 0; }
  `]
})
export class Ratings implements OnInit {
  api = 'http://localhost:3000/api/reviews';
  reviews: any[] = [];
  search = '';
  msg = '';
  hovered = 0;
  form = { employee: '', rating: 0, comment: '' };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
  ngOnInit() { this.load(); }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  private authService = inject(AuthService);

get userRole(): string | null {
  return this.authService.getRole();
}

  load() {
    const url = this.search ? `${this.api}/${this.search}` : this.api;
    this.http.get<any[]>(url).subscribe({
      next: data => { this.reviews = [...data]; this.cdr.detectChanges(); },
      error: () => this.reviews = []
    });
  }

  submit() {
    if (!this.form.employee || !this.form.rating) { this.msg = 'val'; return; }
    this.http.post(this.api, this.form).subscribe({
      next: () => {
        this.msg = 'ok';
        this.load();
        this.form = { employee: '', rating: 0, comment: '' };
        setTimeout(() => this.msg = '', 3000);
      },
      error: () => this.msg = 'err'
    });
  }

  delete(id: number) {
    this.http.delete(`${this.api}/${id}`).subscribe(() => this.load());
  }
}