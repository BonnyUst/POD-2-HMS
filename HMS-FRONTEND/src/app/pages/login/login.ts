import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(private auth: Auth,
    private router: Router

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

        localStorage.setItem(
          'token',
          res.data.token
        );

        localStorage.setItem(
          'role',
          res.data.user.roleId.name
        );
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (res.data.user.mustChangePassword===true) {
          this.router.navigate(['/change-password']);
          return;
        } 

        console.log(loginData)
        if (res.data.user.roleId.name === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      },

      error: (err) => {
        console.log(err);
      }
    });
  }
}
