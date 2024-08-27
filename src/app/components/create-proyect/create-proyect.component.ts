import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import { Proyecto } from '../../models/Proyecto';
import { format } from 'date-fns';

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {

  user = new Usuario();
  userListGet: Usuario[] = [];
  selectedUserIds: number[] = []; // Array to hold selected user IDs
  proyect = new Proyecto();
  isDisabled = false;

  constructor(
    private service: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual
    this.service.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log("Usuario Sesión: ", user.username);
    });

    // Obtener la lista de usuarios
    this.service.getUsers().subscribe({
      next: (users: Usuario[]) => {
        this.userListGet = users;
        console.log("Lista de usuarios: ", this.userListGet);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  onUserSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedUserId = Number(target.value);

    if (selectedUserId === null || isNaN(selectedUserId)) {
      // Handle placeholder selection or do nothing
      return;
    }

    // Verificar si el ID del usuario ya está en la lista de seleccionados
    if (!this.selectedUserIds.includes(selectedUserId)) {
      // Añadir el ID del usuario a la lista si no está ya en ella
      this.selectedUserIds.push(selectedUserId);
    }
    console.log(this.selectedUserIds);
  }

  removeUser(userId: number): void {
    // Eliminar el ID del usuario de la lista de seleccionados
    this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
  }

  createProyect(): void {
    //se le asigna la id del usario que crea el proyecto, a la id del jefe de proyecto
    this.proyect.id_boss = this.user.id;
    this.proyect.date_create = format(new Date(), 'dd-MM-yyyy');

    // Asignar solo los IDs a la propiedad usuarios
    this.proyect.usuarios = this.selectedUserIds;

    console.log("Datos a enviar al backend, del proyecto:", this.proyect);
    this.service.createProyect(this.proyect).subscribe({
      next: (response) => {
        // Successfully registered, redirect to main page
        console.log("Respuesta del servidor:", response);
        // cambiar ruta --> this.router.navigateByUrl('login');
      },
      error: (error) => {
        // Handle any type of error
        console.error('Error al enviar datos:', error);
      }
    });
  }
}
