import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = new Usuario();
  service = inject(DataService);

  constructor(private router: Router) {}

  login(): void {
    // Imprimir los datos que se enviarán al backend
    console.log("Datos a enviar al backend:", this.user);

    // Enviar datos al backend
    this.service.login(this.user).subscribe({
      next: (response) => {
        // Manejo exitoso de la respuesta
        console.log("Respuesta del servidor:", response);

        // Verificar si el mensaje de respuesta es 'Login exitoso'
        if (response.message === 'Login exitoso') {
          this.router.navigateByUrl('main-page');
        } else {
          // Mostrar mensaje de error cuando el login falla
          console.error('Error en el login:', response.message);
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (error) => {
        // Manejo del error
        console.error('Error al enviar datos:', error);
        alert('Error en el login. Por favor, inténtelo de nuevo.');
      }
    });
  }

  toRegisterPage(): void {
    this.router.navigate(['/sign-up']);
    console.log("Redirigiendo a la página de registro");
  }
}
