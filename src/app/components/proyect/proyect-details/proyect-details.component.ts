import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { Proyecto } from '../../../models/Proyecto';
import { Usuario } from '../../../models/Usuario';

@Component({
  selector: 'app-proyect-details',
  templateUrl: './proyect-details.component.html',
  styleUrl: './proyect-details.component.css'
})
export class ProyectDetailsComponent implements OnInit {
  proyectId: number = 0;
  proyect_details = new Proyecto();
  user_boss = new Usuario();
  user_list: Usuario[]= [];
  user = new Usuario();

  constructor(private route: ActivatedRoute,private service: DataService,
    private router: Router,) {}

    ngOnInit(): void {
      this.proyectId = +this.route.snapshot.paramMap.get('id')!; // Aseguramos que el id nunca será null con el !
      console.log("El id del proyecto es: ", this.proyectId);

      this.service.getProyectoById(this.proyectId).subscribe({
        next: (proyect: Proyecto) => {
          this.proyect_details = proyect;  // Asigna el proyecto a this.proyect_details
          console.log("Detalles del proyecto: ", this.proyect_details);

          if(this.proyect_details.id_boss){
            this.service.getUser(this.proyect_details.id_boss).subscribe({
              next: (user: Usuario) =>{
                this.user_boss = user;
                console.log("Usuario jefe : ",this.user_boss);
              }
            })
          }
          if(this.proyect_details.id){
            this.service.getUsersByProyectId(this.proyect_details.id).subscribe({
              next: (users: Usuario[]) =>{
                this.user_list = users;
                console.log("Lista de usuarios del proyecto ",this.user_list);
              }
            })

          }
          this.service.getCurrentUser().subscribe({
            next: (user: Usuario) => {
              this.user = user;
              console.log("El usuario que ha iniciado en esta pagina tiene la sesion de : ",this.user);
            }
          }

          )
          this.checkIfBoss();
        },
        error: (error) => {
          console.error('Error al obtener el proyecto: ', error);
        }
      });
    }

    checkIfBoss(){
      if(this.user.id == this.proyect_details.id_boss){
        console.log("Eres el boss del proyecto")
      }
      else{
        console.log("Eres un  user del proyecto")

      }
    }

    goBack(){
      this.router.navigate(['main-page']);
    }

}
