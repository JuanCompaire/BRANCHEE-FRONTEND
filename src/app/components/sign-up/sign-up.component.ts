import { Component, inject } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';

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
  signUp(form: any) {
    if (form.invalid) {
      // Handle the case where the form is invalid
      console.error('El formulario es inválido');
      return;
    }

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
