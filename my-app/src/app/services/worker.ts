import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Worker } from '../models/worker.model';

@Injectable({ providedIn: 'root' })
export class WorkerService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/workers';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getAllWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(this.apiUrl);
  }

  registerWorker(worker: Worker): Observable<Worker> {
    return this.http.post<Worker>(this.apiUrl, worker, { headers: this.headers });
  }

  deleteWorker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}