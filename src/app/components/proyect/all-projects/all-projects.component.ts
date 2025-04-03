import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import { Proyecto } from '../../../models/Proyecto';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent implements OnInit {

  user = new Usuario();
  proyectList: Proyecto[] = [];
  searchTerm: string = '';
  filteredProjects: any[] | null = null;

  constructor(
    private service: DataService, // Usa inyección a través del constructor
    private router: Router,
  ){}

  ngOnInit(): void {
    //to get the user, and then find the projects in where he/she is included
    this.service.getCurrentUser().pipe(
      switchMap(user => {
        this.user = user;
        console.log("Usuario Sesión: ", user);
        return this.service.getProyectosByUserIdAllDetails(user.id);
      })
    ).subscribe({
      next : (projects: Proyecto[]) => {
        this.proyectList = projects;
        console.log("Lista de projects : ",this.proyectList);
      },
      error: (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    });
  }

  toCreateProyect(): void{
    console.log("REDIRECT TO CREATE PROYECT PAGE");
    this.router.navigateByUrl('create-proyect');
  }

  toProyectDetailsPage(id?: number): void{
    if (id !== undefined && id !== null) {
      this.router.navigate(['/details-proyect', id]);
   }else {
      console.error('Error: ID es undefined o null');
    }
  }

  filterProjects() {
    if (!this.searchTerm) {
      this.filteredProjects = null;
      return;
    }

    this.filteredProjects = this.proyectList.filter(project =>
      project.name_proyect.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goBack(): void {
    this.router.navigate(['main-page']);
  }

}
