import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(
      'http://localhost:3000/api/auth/login',
      this.loginForm.value
    )
    .subscribe({
      next: (response) => {

        console.log('LOGIN SUCCESS', response);

        localStorage.setItem('token', response.data);

        this.router.navigate(['/dashboard']);

        this.isLoading = false;
      },

      error: (error) => {

        console.log(error);

        this.errorMessage =
          error?.error?.message ||
          'Invalid email or password';

        this.isLoading = false;
      }
    });
  }
}