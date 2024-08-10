import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrl: './sing-up.component.css'
})
export class SingUpComponent {

  user = new Usuario()
  service = inject(DataService);

  constructor(private router: Router) {}

  signUpUser(form: any){
    if (form.invalid) {
      // Handle the case where the form is invalid
      console.error('El formulario es inválido');
      return;
    }
    // Save all user data in "data"
    const data = this.user;
    // Show the user data in console
    console.log(this.user);
    // call for signUp method from the service, which will conect to backend
    this.service.signUp(data).subscribe({
      next: (response) => {
        // Successfully registered, redirect to main page
        console.log("Respuesta del servidor:", response);
        this.router.navigateByUrl('login');
      },
      error: (error) => {
        // Handle any type of error
        console.error('Error al enviar datos:', error);
      }
    });

  }


}
