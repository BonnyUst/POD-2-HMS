import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email='';
  password='';

  constructor(private auth:Auth,
    private router:Router

  ){}

  onLogin(){
    const loginData={
      email:this.email,
      password:this.password
    };
    this.auth.login(loginData).subscribe({
      next:(res)=>{
        console.log(res);

        localStorage.setItem(
          'token',
          res.data.token
        );

        localStorage.setItem(
          'role',
          res.data.user.roleId.name
        );

        console.log(loginData)
         if (res.data.user.roleId.name === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      },

      error:(err)=>{
        console.log(err);
      }
    });
  }
}
