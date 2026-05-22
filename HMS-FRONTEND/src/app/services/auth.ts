import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:5000/api/auth';
  
  constructor(private http:HttpClient){}

  login(loginData:any)
  {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      loginData
    );
  }
}
