import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  user = new Usuario();
  service = inject(DataService);

  constructor(private router: Router,) {}

  ngOnInit(): void {
    // Obtener el usuario actual
    this.service.getCurrentUser().subscribe(user => {
      if (user != null){
        this.user = user;
      console.log("Usuario Sesión: ", user.username);
      }
      //esto es lo que tendria que pasar, ya que si esta en login, no hay ningun usuario en la sesion
      else{
        console.log("El usario es nulo, no hay sesion de ningun usuario, se ha hecho el LOG OUT bien")
      }
    });
  }

  login(): void {
    console.log("Datos a enviar al backend:", this.user);

    this.service.login(this.user).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);

        if (response.token) {
          // Almacena el token y redirige al usuario
          this.service.setToken(response.token);
          console.log("Token almacenado en localStorage:", localStorage.getItem('authToken'));
          this.router.navigateByUrl('main-page');
          console.log("Token set y login correcto");
      } else {
          console.error('Error en el login:', response.message || 'Token no recibido');
          alert('Usuario o contraseña incorrectos');
      }

      },
      error: (error) => {
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
