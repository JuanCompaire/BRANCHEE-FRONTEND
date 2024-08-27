import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../service/excel.service';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'] // Asegúrate de ajustar la propiedad correctamente
})
export class MainPageComponent implements OnInit {

  user = new Usuario();
  userListGet: Usuario[] = [];

  constructor(
    private service: DataService, // Usa inyección a través del constructor
    private router: Router,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual
    this.service.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log("Usuario Sesión: ", user.username);
    });

    // Obtener la lista de usuarios
    this.service.getUsers().subscribe({
      next: (users: Usuario[]) => {
        this.userListGet = users;
        console.log("Lista de usuarios: ", this.userListGet);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  exportExcel(): void{
    console.log("Making the Excel");
    this.excelService.exportAsExcelFile(this.userListGet,"");
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
}
