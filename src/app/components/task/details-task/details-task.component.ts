import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { Tarea } from '../../../models/Tarea';
import { Usuario } from '../../../models/Usuario';

@Component({
  selector: 'app-details-task',
  templateUrl: './details-task.component.html',
  styleUrl: './details-task.component.css'
})
export class DetailsTaskComponent implements OnInit{

  taskId = 0;
  taskDetails = new Tarea();
  user = new Usuario();
  status_options = ["OPEN","WORKING ON IT","CLOSED"];
  import_options = ["LOW","MEDIUM","HIGH"];

  constructor(private route: ActivatedRoute, private service: DataService, private router: Router) {}

  ngOnInit(): void {
      this.taskId = +this.route.snapshot.paramMap.get('id')!;
      this.loadTaskDetails();
      this.service.getCurrentUser().subscribe({
        next: (user: Usuario) => {
          this.user = user;
          console.log("El usuario es : ",user);
        }
      });
    }

    loadTaskDetails(){
      this.service.getTaskById(this.taskId).subscribe({
        next: (task : Tarea) => {
          this.taskDetails = task;
          console.log("Los taskDetails son : ",this.taskDetails);
        },
        error: (error) => {
          console.error('Error al obtener el proyecto: ', error);
        }
      })
    }

    editTask(){
      console.log("TASK DETAILS EDITED : ",this.taskDetails);
      this.service.editTask(this.taskDetails).subscribe({
        next: (response) => {
          console.log("Respuesta del servidor:", response);
          this.router.navigate(['/main-page']);
        },
        error: (error) => {
          // Handle any type of error
          console.error('Error al enviar datos:', error);
        }
      });
    }

    goBack() {
      this.router.navigate(['main-page']);
    }

}
