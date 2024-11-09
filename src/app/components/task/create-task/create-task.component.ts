import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { Tarea } from '../../../models/Tarea';
import { Proyecto } from '../../../models/Proyecto';
import { switchMap } from 'rxjs';
import { Usuario } from '../../../models/Usuario';

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

  createTask(){

  }

  toggleDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  selectProject(proyect: any) {
    this.task.id_proyect = proyect.name;
    this.isDropDownOpen = false;
  }

  goBack() {
    this.router.navigate(['main-page']);
  }
}
