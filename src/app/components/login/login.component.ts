import { Component, inject } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // User to login the page
  user: Usuario = new Usuario();
  service = inject(DataService);
  router = inject(Router);

  constructor() {}

}
