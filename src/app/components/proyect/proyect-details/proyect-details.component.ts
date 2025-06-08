import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { Proyecto } from '../../../models/Proyecto';
import { Usuario } from '../../../models/Usuario';

@Component({
  selector: 'app-proyect-details',
  templateUrl: './proyect-details.component.html',
  styleUrls: ['./proyect-details.component.css']
})
export class ProyectDetailsComponent implements OnInit {
  proyectId: number = 0;
  proyect_details = new Proyecto();
  user_boss = new Usuario();
  user_list: Usuario[] = [];
  //selectedUserIds: Usuario[] = [];
  selectedUsers: { usuarioId: number; username: string; email: string }[] = [];
  user = new Usuario();
  isDisabled = false;
  showUserList: boolean = false;
  userIsBoss: boolean = false;

  constructor(private route: ActivatedRoute, private service: DataService, private router: Router) {}

  ngOnInit(): void {
  this.service.getCurrentUser().subscribe({
    next: (user: Usuario) => {
      this.user = user;
      console.log("Usuario cargado correctamente: ", this.user);
      this.proyectId = +this.route.snapshot.paramMap.get('id')!;
      this.loadProjectDetails();
    },
    error: (error) => {
      console.error('Error al obtener el usuario actual:', error);
    }
  });
}


  loadProjectDetails() {
    this.service.getProyectoById(this.proyectId).subscribe({
      next: (proyect: Proyecto) => {
        this.proyect_details = proyect;
        console.log("Los details del proyect son : ",this.proyect_details);
        if (this.proyect_details.id_boss) {
          this.loadUserBoss(this.proyect_details.id_boss);
        }
        if (this.proyect_details.proyectoId) {
          this.selectedUsers = this.proyect_details.usuarios;
          console.log("los usuarios iniciales del proyecto antes de la edicion son : ",this.selectedUsers);
               }
      },
      error: (error) => {
        console.error('Error al obtener el proyecto: ', error);
      }
    });
  }

  loadUserBoss(bossId: number) {
    this.service.getUser(bossId).subscribe({
      next: (user: Usuario) => {
        this.user_boss = user;
        console.log("El boss es : ", this.user_boss);
        this.checkIfBoss(); // Verificación aquí
      },
      error: (error) => {
        console.error('Error al cargar el jefe:', error);
      }
    });
  }

  searchUser(event: any): void {
    const searchString = event.target.value;

    if (searchString.length != '') { // Cambié != a !==
      this.service.getUsersByString(searchString).subscribe(
        (users: Usuario[]) => {
          this.user_list = users;
          console.log("El string es : ,", searchString + " La lista es : ", this.user_list);
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    }
  }

  checkIfBoss() {
    console.log("El user es : ", this.user);
    this.userIsBoss = this.user.usuarioId === this.proyect_details.id_boss;
    console.log(this.userIsBoss ? "Eres el boss del proyecto" : "Eres un user del proyecto");
  }

  addUser(user: Usuario, userSearch: HTMLInputElement): void {
    if (!this.selectedUsers.some(selectedUser => selectedUser.usuarioId === user.usuarioId)) {
      const userWithOutPassword = {
        usuarioId: user.usuarioId,
        username: user.username,
        email: user.email
      };
      this.selectedUsers.push(userWithOutPassword);
    }
    this.user_list = []; // Eliminar de la lista de usuarios disponibles
    userSearch.value = '';
    console.log("La lista de usuarios seleccionados para este proyecto son : ",this.selectedUsers);
  }

  removeUser(userId: number): void {
    this.selectedUsers = this.selectedUsers.filter(user => user.usuarioId !== userId);
  }

  editProyect(): void {
    const requestBody = {
      proyectoId: this.proyect_details.proyectoId,
      name_proyect: this.proyect_details.name_proyect,
      id_boss: this.proyect_details.id_boss,
      date_created: this.proyect_details.date_created,
      usuarios: this.selectedUsers.map(user => ({
         usuarioId: user.usuarioId,
         username: user.username,
         email:user.email
        })),
      tareas: null
    };
    console.log("PROJECT DETAILS TO EDIT : ",this.proyect_details);
    this.service.editProyect(requestBody).subscribe({
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

  getBorderColor(estado: string): string {
    switch (estado) {
      case 'WORKING ON IT': return 'orange';
      case 'OPEN': return 'green';
      case 'CLOSED': return 'red';
      default: return 'gray'; // Color por defecto si el estado no coincide
    }
  }

  toTaskDetailsPage(id?: number): void{
    if (id !== undefined && id !== null) {
      this.router.navigate(['/details-task', id]);
   }else {
      console.error('Error: ID es undefined o null');
    }
  }

  toCreateTask(): void{
    console.log("REDIRECT TO CREATE TASK PAGE");
    this.router.navigateByUrl('create-task');
  }

  goBack() {
    this.router.navigate(['main-page']);
  }
}
