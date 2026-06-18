import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateHealthRecordRequest,
  HealthRecordListResponse,
  HealthRecordSingleResponse,
  UpdateHealthRecordRequest
} from '../models/health-record.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthRecordService {
    
  private apiUrl = 'http://localhost:5000/api/health-records';

  constructor(private http: HttpClient) {}

  createHealthRecord(data: CreateHealthRecordRequest): Observable<HealthRecordSingleResponse> {
    return this.http.post<HealthRecordSingleResponse>(`${this.apiUrl}/create`, data);
  }

  getHealthRecords(): Observable<HealthRecordListResponse> {
    return this.http.get<HealthRecordListResponse>(`${this.apiUrl}/list`);
  }

  getHealthRecordById(id: string): Observable<HealthRecordSingleResponse> {
    return this.http.get<HealthRecordSingleResponse>(`${this.apiUrl}/${id}`);
  }

  updateHealthRecord(
    id: string,
    data: UpdateHealthRecordRequest
  ): Observable<HealthRecordSingleResponse> {
    return this.http.put<HealthRecordSingleResponse>(`${this.apiUrl}/update/${id}`, data);
  }

  finalizeHealthRecord(id: string): Observable<HealthRecordSingleResponse> {
    return this.http.put<HealthRecordSingleResponse>(`${this.apiUrl}/finalize/${id}`, {});
  }

  deleteHealthRecord(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/delete/${id}`);
  }
}