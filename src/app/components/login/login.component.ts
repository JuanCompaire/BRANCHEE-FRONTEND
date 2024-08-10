import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router) {}

  toRegisterPage(): void{
    this.router.navigate(['/sign-up']);
    console.log("Redirect to Register Page");
  }

}
