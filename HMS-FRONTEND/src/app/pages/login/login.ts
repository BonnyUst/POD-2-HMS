import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(readonly auth: Auth,
    readonly router: Router

  ) { }

  onLogin() {
    const loginData = {
      email: this.email,
      password: this.password
    };
    this.auth.login(loginData).subscribe({
      next: (res) => {

        console.log("LOGIN RESPONSE:", res);
        console.log("ROLE NAME:", res.data.user.roleId.name);
        console.log("ROLE CODE:", res.data.user.roleId.roleCode);
        console.log("MUST CHANGE PASSWORD:", res.data.user.mustChangePassword);
        const basePath = res.data.user.roleId.basePath;

        localStorage.setItem(
          'token',
          res.data.token
        );

        localStorage.setItem(
          'role',
          res.data.user.roleId.name
        );
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('basePath', res.data.user.roleId.basePath);
        console.log("basePath", res.data.user.roleId.basePath);

        if (res.data.user.mustChangePassword === true) {
          this.router.navigate(['/change-password']);
          return;
        }

        console.log(loginData)
        if (res.data.user.roleId.name === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        }
        else if (res.data.user.roleId.name === 'Receptionist') {
          this.router.navigate([`${basePath}/patients`]);
        }
        else if (res.data.user.roleId.name === 'Doctor') {
          this.router.navigate([`${basePath}/appointments`]);
        }
      },



      error: (err) => {
        console.log(err);
      }
    });
  }
}
