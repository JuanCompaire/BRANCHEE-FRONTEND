import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { Tarea } from '../../../models/Tarea';
import { Proyecto } from '../../../models/Proyecto';
import { switchMap } from 'rxjs';
import { Usuario } from '../../../models/Usuario';
import { formatDate } from '@angular/common';
import { formatDistanceStrict } from 'date-fns';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit{

  proyectList: Proyecto[] = [];
  task = new Tarea();
  user = new  Usuario;
  isDropDownOpen = false;
  selectedFile: File | null = null;
  selectedProjectName: string = '';
  status_options = ["OPEN","WORKING ON IT","CLOSED"];
  import_options = ["LOW","MEDIUM","HIGH"];
  assignedUsers: { usuarioId: number; username: string; email: string }[] = [];
  assignedUsers_options: { usuarioId: number; username: string; email: string }[] = [];

  constructor(
    private service: DataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual y luego los proyectos a los que pertenece
    this.service.getCurrentUser().pipe(
      // Una vez que obtienes el usuario, utiliza switchMap para encadenar la llamada a getProyectosByUserId
      switchMap(user => {
        this.user = user;  // Asigna el usuario a this.user
        console.log("Usuario Sesión: ", user);
        // Llama al servicio para obtener los proyectos usando el ID del usuario
        return this.service.getProyectosByUserId(user.id);
      })
    ).subscribe({
      next: (proyects: Proyecto[]) => {
        this.proyectList = proyects;  // Asigna los proyectos a this.proyectList
        console.log("Lista de proyectos: ", this.proyectList);
      },
      error: (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    });
  }

  // create task function
  createTask(){
    const newDate = new Date();
    const todayDate = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;

    //we put today date to the creation and last update attribute
    this.task.date_last_update = todayDate;
    this.task.date_create = todayDate;
    this.task.user_id_created_task = this.user.usuarioId;
    this.task.usuarios = this.assignedUsers;

    const formData = new FormData();
    formData.append('task', new Blob([JSON.stringify(this.task)], { type: 'application/json' }));

    // Si hay archivo, lo añadimos al FormData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // Llamamos al servicio con la única llamada optimizada
    this.service.createTask(formData).subscribe({
      next: (response) => {
          console.log('Task created:', response);
          this.router.navigate(['/main-page']);
      },
      error: (error) => {
          console.error('Error creating the task:', error);
      }
    });

    console.log("TASK DATA :", this.task);
  }

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  selectProject(proyect: Proyecto) {
    console.log("EL proyect que entra en el selectProject es : ", proyect);
    this.task.id_proyecto = proyect.proyectoId;
    this.selectedProjectName = proyect.name_proyect; // Guarda el nombre del proyecto seleccionado
    console.log("El task id_proyect es : ", this.task.id_proyecto);
    this.isDropDownOpen = false;

    this.service.getUsersByProyectId(this.task.id_proyecto ?? 0).subscribe({
      next: (users: Usuario[]) => {
        this.assignedUsers_options = users;
        console.log("Los usuarios del proyecto son : ",this.assignedUsers);
      },error: (error) => {
        console.error('Error geting the users of the proyect:', error);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }

  onUserSelected(event: Event){
    const selectedUserId = Number((event.target as HTMLSelectElement).value);
    const selectedUser = this.assignedUsers_options.find(user => user.usuarioId === selectedUserId);

    if (selectedUser) {
      this.addUser(selectedUser.usuarioId, selectedUser.username, selectedUser.email);
    }
  }

  addUser(usuarioId: number, username: string, email: string){
    if(!this.assignedUsers.some(selectedUser => selectedUser.usuarioId === usuarioId)){
      this.assignedUsers.push({usuarioId,username,email});
      console.log("La lista de assignedUsers ha sido modificada : ", this.assignedUsers);
    }
  }

  removeUser(userId: number): void {
    this.assignedUsers = this.assignedUsers.filter(user => user.usuarioId !== userId);
    console.log("La lista de assignedUsers ha sido modificada : ", this.assignedUsers);
  }

  goBack() {
    this.router.navigate(['main-page']);
  }
}
