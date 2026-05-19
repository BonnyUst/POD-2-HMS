import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],

  templateUrl: './profile.html',

  styleUrls: ['./profile.css']
})

export class Profile implements OnInit {

  private fb = inject(FormBuilder);

  private http = inject(HttpClient);

  isLoading = false;

  successMessage = '';

  errorMessage = '';

  profileImage =
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';


  profileForm = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    phone: ['', Validators.required],

    gender: ['OTHER'],

    address: [''],

    dateOfBirth: ['']
  });


  passwordForm = this.fb.group({

    currentPassword: ['', Validators.required],

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });


  ngOnInit(): void {
    this.getProfile();
  }


  getProfile() {

    this.isLoading = true;

    this.http.get<any>(
      'http://localhost:3000/api/auth/me'
    )
    .subscribe({

      next: (response) => {

        const user = response.data.user;

        this.profileForm.patchValue({

          firstName: user.firstName,

          lastName: user.lastName,

          phone: user.phone,

          gender: user.gender,

          address: user.address,

          dateOfBirth: user.dateOfBirth
        });

        if (user.profileImage) {
          this.profileImage = user.profileImage;
        }

        this.isLoading = false;
      },

      error: (error) => {

        console.log(error);

        this.errorMessage = 'Failed to load profile';

        this.isLoading = false;
      }
    });
  }


  updateProfile() {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.http.put(
      'http://localhost:3000/api/users/profile',
      this.profileForm.value
    )
    .subscribe({

      next: () => {

        this.successMessage =
          'Profile updated successfully';

        this.errorMessage = '';
      },

      error: (error) => {

        console.log(error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to update profile';
      }
    });
  }


  changePassword() {

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.http.put(
      'http://localhost:3000/api/users/change-password',
      this.passwordForm.value
    )
    .subscribe({

      next: () => {

        this.successMessage =
          'Password updated successfully';

        this.errorMessage = '';

        this.passwordForm.reset();
      },

      error: (error) => {

        console.log(error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to update password';
      }
    });
  }
}