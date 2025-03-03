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
    var newDate = new Date();
    const todayDate = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;
    //we put today date to the creation and last update attribute
    this.task.date_last_update = todayDate;
    this.task.date_create = todayDate;

    if(this.selectedFile){
      const formData = new FormData();
      formData.append('file',this.selectedFile);
      formData.append('task',JSON.stringify(this.task));

      this.service.createTaskPhoto(formData).subscribe({
        next: (response) => {
          console.log('Task created with photo:', response);
          this.router.navigate(['/main-page']);

        },
        error: (error) => {
          console.error('Error creating the task with photo:', error);
        },
      });
    } else {
      // Si no hay archivo, simplemente crea la tarea
      this.service.createTask(this.task).subscribe({
        next: (response) => {
          console.log('Task created:', response);
          this.router.navigate(['/main-page']);
        },
        error: (error) => {
          console.error('Error creating the task:', error);
        },
      });
    }

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
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }

  goBack() {
    this.router.navigate(['main-page']);
  }
}
