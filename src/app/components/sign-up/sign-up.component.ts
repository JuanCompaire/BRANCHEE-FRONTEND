import { Component, inject } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from '../../service/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  // User to be registered
  user: Usuario = new Usuario();
  service = inject(DataService);
  router = inject(Router);

  constructor() {}

  // Method to create a user and register
  signUp() {
    // Save all user data in "data"
    const data = this.user;

    // Show the user data in console
    console.log(this.user);

    this.service.signUp(data).subscribe({
      next: (response) => {
        // Successfully registered, redirect to main page
        console.log("Respuesta del servidor:", response);
        this.router.navigateByUrl('main');
      },
      error: (error) => {
        // Handle any type of error
        console.error('Error al enviar datos:', error);
      }
    });
  }
}
