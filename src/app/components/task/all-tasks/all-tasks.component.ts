import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import { DataService } from '../../../service/data.service';
import { Router } from '@angular/router';
import { Tarea } from '../../../models/Tarea';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.css'
})
export class AllTasksComponent implements OnInit{

  user = new Usuario();
  taskList: Tarea[] = [];
  searchTerm: string = '';
  filteredTasks: any[] | null = null;
  showOnlyMyTasks: boolean = false;


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
        return this.service.getTasksByUserIdAllDetails(user.id);
      })
    ).subscribe({
      next : (tasks: Tarea[]) => {
        this.taskList = tasks;
        console.log("Lista de tasks : ",this.taskList);
      },
      error: (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    });
  }

  toCreateTask(): void{
    console.log("REDIRECT TO CREATE TASK PAGE");
    this.router.navigateByUrl('create-task');
  }

  toTaskDetailsPage(id?: number): void{
    if (id !== undefined && id !== null) {
      this.router.navigate(['/details-task', id]);
   }else {
      console.error('Error: ID es undefined o null');
    }
  }

  filterTasks() {
    let filtered = [...this.taskList];

    // Aplicar filtro de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(task =>
        task.name_task.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de tareas asignadas
    if (this.showOnlyMyTasks) {
      filtered = filtered.filter(task =>
        task.usuarios.some(user => user.usuarioId === this.user.usuarioId)
      );
    }

    this.filteredTasks = filtered;
  }

  toggleMyTasksFilter() {
    this.showOnlyMyTasks = !this.showOnlyMyTasks;
    this.filterTasks();
  }

  goBack(): void {
    this.router.navigate(['main-page']);
  }

}
