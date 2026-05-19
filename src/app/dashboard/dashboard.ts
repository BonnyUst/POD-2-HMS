import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './dashboard.html',

  styleUrls: ['./dashboard.css']
})

export class Dashboard implements OnInit {

  constructor(private router: Router) {}

  showSidebar = false;

  showProfileMenu = false;

  userRole = '';

  isAdmin = false;

  profileImage =
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';


  ngOnInit(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const payload =
        JSON.parse(atob(token.split('.')[1]));

      this.userRole =
        payload.role;

      this.isAdmin =
        this.userRole === 'ADM';

    }
    catch (error) {

      console.log(error);
    }
  }


  toggleSidebar() {

    this.showSidebar =
      !this.showSidebar;
  }


  toggleProfileMenu() {

    this.showProfileMenu =
      !this.showProfileMenu;
  }


  logout() {

    localStorage.removeItem('token');

    this.router.navigate(['/']);
  }
}