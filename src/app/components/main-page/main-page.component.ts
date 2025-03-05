import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../service/excel.service';
import { Proyecto } from '../../models/Proyecto';
import { switchMap } from 'rxjs';
import { Tarea } from '../../models/Tarea';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'] // Asegúrate de ajustar la propiedad correctamente
})
export class MainPageComponent implements OnInit {

  user = new Usuario();
  proyectList: Proyecto[] = [];
  taskList:Tarea[] = [];
  showProjects : boolean = false;

  constructor(
    private service: DataService, // Usa inyección a través del constructor
    private router: Router,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual y luego los proyectos a los que pertenece
    this.service.getCurrentUser().pipe(
      // Una vez que obtienes el usuario, utiliza switchMap para encadenar la llamada a getProyectosByUserId
      switchMap(user => {
        this.user = user;  // Asigna el usuario a this.user
        console.log("Usuario Sesión: ", user);
        this.service.getTasksByUserId(user.id).subscribe(
          {
            next : (tasks : Tarea[]) => {
              this.taskList = tasks;
              console.log("Lista de tasks: ", this.taskList);
            }
          }
        );
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

  logOut(): void{
    console.log("LOG OUT");
    this.service.logout();
    this.router.navigateByUrl('login');
  }

  toCreateProyect(): void{
    console.log("REDIRECT TO CREATE PROYECT PAGE");
    this.router.navigateByUrl('create-proyect');
  }
  toCreateTask(): void{
    console.log("REDIRECT TO CREATE TASK PAGE");
    this.router.navigateByUrl('create-task');
  }

  toProyectDetailsPage(id?: number): void{
    if (id !== undefined && id !== null) {
      this.router.navigate(['/details-proyect', id]);
   }else {
      console.error('Error: ID es undefined o null');
    }
  }
  toTaskDetailsPage(id?: number): void{
    if (id !== undefined && id !== null) {
      this.router.navigate(['/details-task', id]);
   }else {
      console.error('Error: ID es undefined o null');
    }
  }
}
