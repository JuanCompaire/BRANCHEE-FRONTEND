import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { Tarea } from '../../../models/Tarea';
import { Usuario } from '../../../models/Usuario';
import { concatMap, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-task',
  templateUrl: './details-task.component.html',
  styleUrl: './details-task.component.css'
})
export class DetailsTaskComponent implements OnInit{

  taskId = 0;
  taskDetails = new Tarea();
  user = new Usuario();
  user_created_task = new Usuario();
  user_assigned_task_list: Usuario[] = [];
  status_options = ["OPEN","WORKING ON IT","CLOSED"];
  import_options = ["LOW","MEDIUM","HIGH"];
  assignedUsers: { usuarioId: number; username: string; email: string }[] = [];
  assignedUsers_options: { usuarioId: number; username: string; email: string }[] = [];

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

      // loadTaskDetails() {
      //   this.service.getTaskById(this.taskId).pipe(
      //     switchMap((task: Tarea) => {
      //       this.taskDetails = task;
      //       this.assignedUsers = task.usuarios;
      //       console.log("Los taskDetails son:", this.taskDetails);
      //       return this.service.getUser(task.user_id_created_task);
      //     })
      //   ).subscribe({
      //     next: (user: Usuario) => {
      //       this.user_created_task = user;
      //       console.log("El usuario que creó la tarea ha sido cargado:", this.user_created_task);
      //     },
      //     error: (error) => {
      //       console.error("Error al obtener datos:", error);
      //     }
      //   });
      // }

    //try with concatMap y forkJoin
    loadTaskDetails() {
      this.service.getTaskById(this.taskId).pipe(
        concatMap((task: Tarea) => {
          this.taskDetails = task;
          this.assignedUsers = task.usuarios;
          console.log("Los taskDetails son:", this.taskDetails);

          return forkJoin({
            user: this.service.getUser(task.user_id_created_task),
            users_posibilities_assigned : this.service.getUsersByProyectId(task.id_proyecto)
          }).pipe(
            map(({user,users_posibilities_assigned}) => ({ task, user, users_posibilities_assigned }))
          );
        })
      ).subscribe({
        next: ({ user, users_posibilities_assigned }) => {
          this.user_created_task = user;
          console.log("Usuario que creó la tarea:", this.user_created_task);
          this.assignedUsers_options = users_posibilities_assigned;
          console.log("Usuarios para elegir asignar la tarea", this.assignedUsers_options);
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    }

    editTask(){
      console.log("TASK DETAILS EDITED : ",this.taskDetails);
      this.taskDetails.usuarios = this.assignedUsers;
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
