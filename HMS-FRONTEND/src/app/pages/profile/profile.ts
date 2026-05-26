import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profile: any = null;
  errorMessage = '';
  

  constructor(private auth: Auth,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.auth.getProfile().subscribe({
      next: (res) => {
        console.log('Profile response:', res);
        this.profile = res.data;
         this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Profile fetch error:', err);
        this.errorMessage = err.error?.message || 'Failed to load profile';
      }
    });


  }

}