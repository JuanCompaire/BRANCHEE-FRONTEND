import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { DataService } from '../../service/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{

  user = new Usuario();
  service = inject(DataService);

  constructor(private router: Router) {}

  ngOnInit(): void {
      this.service.getCurrentUser().subscribe(user => {
        this.user = user;
        console.log("Usuario Sesion : "+user.username);
      })
  }




}
