import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { Proyecto } from '../../../models/Proyecto';
import { Usuario } from '../../../models/Usuario';

@Component({
  selector: 'app-proyect-details',
  templateUrl: './proyect-details.component.html',
  styleUrls: ['./proyect-details.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export class ProyectDetailsComponent implements OnInit {
  proyectId: number = 0;
  proyect_details = new Proyecto();
  user_boss = new Usuario();
  user_list: Usuario[] = [];
  selectedUserIds: Usuario[] = [];
  user = new Usuario();
  isDisabled = false;
  showUserList: boolean = false;
  userIsBoss: boolean = false;

  constructor(private route: ActivatedRoute, private service: DataService, private router: Router) {}

  ngOnInit(): void {
    this.proyectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProjectDetails();
    this.service.getCurrentUser().subscribe({
      next: (user: Usuario) => {
        this.user = user;
        // Ya no llamamos a checkIfBoss aquí
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
        if (this.proyect_details.id) {
          this.loadProjectUsers(this.proyect_details.id);
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

  loadProjectUsers(proyectId: number) {
    this.service.getUsersByProyectId(proyectId).subscribe({
      next: (users: Usuario[]) => {
        this.selectedUserIds = users; // Asigna los usuarios del proyecto a la lista seleccionada
        console.log("La lista de usuarios del proyecto es : ", this.selectedUserIds);
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
    this.userIsBoss = this.user.id === this.proyect_details.id_boss;
    console.log(this.userIsBoss ? "Eres el boss del proyecto" : "Eres un user del proyecto");
  }

  addUser(user: Usuario, userSearch: HTMLInputElement): void {
    if (!this.selectedUserIds.some(selectedUser => selectedUser.id === user.id)) {
      this.selectedUserIds.push(user);
    }
    this.user_list = []; // Eliminar de la lista de usuarios disponibles
    userSearch.value = '';
    console.log("La lista de usuarios seleccionados para este proyecto son : ",this.selectedUserIds);
  }

  removeUser(userId: number): void {
    this.selectedUserIds = this.selectedUserIds.filter(user => user.id !== userId);
  }

  editProyect(): void {
    this.service.editProyect(this.proyect_details,this.selectedUserIds.map(user => user.id)).subscribe({
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
