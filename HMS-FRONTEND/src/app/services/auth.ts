import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<any>('http://localhost:5000/api/users/profile');
  }

  private baseUrl = 'http://localhost:5000/api';

  checkJoinUsEmail(data: any) {
    return this.http.post(`${this.baseUrl}/join-us/check-email`, data);
  }

  joinUs(data: any) {
    return this.http.post('http://localhost:5000/api/join-us/create', data);
  }

  login(loginData: any) {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      loginData
    );
  }
}
