import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor, CreateDoctorPayload } from '../models/doctor.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllDoctors(): Observable<ApiResponse<Doctor[]>> {
    return this.http.get<ApiResponse<Doctor[]>>(`${this.baseUrl}/doctors/list`);
  }

  createDoctor(payload: CreateDoctorPayload): Observable<ApiResponse<Doctor>> {
    return this.http.post<ApiResponse<Doctor>>(`${this.baseUrl}/doctors/create`, payload);
  }

}