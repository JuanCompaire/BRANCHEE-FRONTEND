import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/Usuario';
import { Proyecto } from '../../../models/Proyecto';
import { format } from 'date-fns';

@Component({
  selector: 'app-create-proyect',
  templateUrl: './create-proyect.component.html',
  styleUrls: ['./create-proyect.component.css']
})
export class CreateProyectComponent implements OnInit {

  user = new Usuario();
  userList: Usuario[] = [];
  selectedUserIds: Usuario[] = []; // Array to hold selected user objects
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
  }

  searchUser(event: any): void {
    const searchString = event.target.value;

    if (searchString.length != '') {
      this.service.getUsersByString(searchString).subscribe(
        (users: Usuario[]) => {
          this.userList = users;
          console.log("El string es : ,",searchString+" La lista es : ",this.userList);
        }
        ,
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    }
  }

  addUser(user: Usuario, userSearch: HTMLInputElement): void {
    // Evitar duplicados
    if (!this.selectedUserIds.some(selectedUser => selectedUser.id === user.id)) {
      this.selectedUserIds.push(user);
    }
    this.userList = [];  // Limpiar la lista de sugerencias después de agregar un usuario

    userSearch.value = '';
  }

  removeUser(userId: number): void {
    this.selectedUserIds = this.selectedUserIds.filter(user => user.id !== userId);
  }

  createProyect(): void {
    //se le asigna la id del usario que crea el proyecto, a la id del jefe de proyecto
    this.proyect.id_boss = this.user.id;
    this.proyect.date_create = format(new Date(), 'dd-MM-yyyy');

    console.log("Datos a enviar al backend, del proyecto:", this.proyect);
    console.log("Datos a enviar al backend, de los usuarios:", this.selectedUserIds);
    this.service.createProyect(this.proyect, this.selectedUserIds.map(user => user.id)).subscribe({
      next: (response) => {
        // Successfully registered, redirect to main page
        console.log("Respuesta del servidor:", response);
        this.router.navigate(['/main-page']);

      },
      error: (error) => {
        // Handle any type of error
        console.error('Error al enviar datos:', error);
      }
    });
  }
}
