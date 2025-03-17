import { formatDistanceStrict } from 'date-fns';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { Tarea } from '../../../models/Tarea';
import { Usuario } from '../../../models/Usuario';
import { concatMap, forkJoin, map, switchMap } from 'rxjs';
import { Chat } from '../../../models/Chat';

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
  createCommentActivated = false;
  selectedFile: File | null = null;
  chat = new Chat();

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
      //meter a los usuarios asignados manualmente al array de usuarios de Task
      this.taskDetails.usuarios = this.assignedUsers
      const formData = new FormData();

      //si se crea un comentario en el caht del task
      if(this.createCommentActivated ||this.chat.descripcion!=='' ){
        this.chat.id_tarea = this.taskDetails.tareaId;
        this.chat.user_id_created_chat = this.user.usuarioId;
        this.chat.date_create_chat = new Date().toDateString();
        console.log(this.chat);
        this.taskDetails.chats.push(this.chat);
        if(this.selectedFile){
          formData.append('file',this.selectedFile);
        }
      }

      formData.append('task',new Blob([JSON.stringify(this.taskDetails)], { type: 'application/json' }));

      this.service.editTaskWithChat(formData).subscribe({
        next: (response) => {
          console.log('Task with Chats edited correctly : ', response);
          this.router.navigate(['/main-page']);
        }, error: (error) => {
          console.error('Error editing Task with Chats : ', error);
        },
      })
    }

    // editTask(){
    //   this.taskDetails.usuarios = this.assignedUsers;
    //   if(this.createCommentActivated || this.chat.descripcion!==''){
    //     console.log("Hay un coment en el editTask");
    //     this.chat.tareaId = this.taskDetails.tareaId;
    //     this.chat.user_id_created_chat = this.user.usuarioId;
    //     this.chat.date_create_chat = new Date().toDateString();
    //     console.log(this.chat);
    //     this.taskDetails.chats.push(this.chat);
    //     console.log(this.taskDetails);

    //     if(this.selectedFile){
    //       const formData = new FormData();
    //       formData.append('file',this.selectedFile);
    //       formData.append('task',new Blob([JSON.stringify(this.taskDetails)], { type: 'application/json' }));

    //       this.service.editTaskWithChat(formData).subscribe({
    //         next: (response) => {
    //           console.log('Task with Chats edited correctly : ', response);
    //           this.router.navigate(['/main-page']);
    //         },
    //         error: (error) => {
    //           console.error('Error editing Task with Chats : ', error);
    //         },
    //       })
    //     }
    //   }else{
    //   this.service.editTaskNoComments(this.taskDetails).subscribe({
    //     next: (response) => {
    //       console.log("Respuesta del servidor:", response);
    //       this.router.navigate(['/main-page']);
    //     },
    //     error: (error) => {
    //       // Handle any type of error
    //       console.error('Error al enviar datos:', error);
    //     }
    //   });
    //   }
    // }

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

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        console.log('Archivo seleccionado:', this.selectedFile);
      }
    }

    createComment(){
      this.createCommentActivated = true;
      console.log("El createCommentActivated es : ",this.createCommentActivated);
    }

    goBack() {
      this.router.navigate(['main-page']);
    }

}
