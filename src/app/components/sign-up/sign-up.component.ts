import { Component } from '@angular/core';
import { Usuario } from '../../model/Usuario';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  user: Usuario = new Usuario();

  constructor() {}

  signUp() {

    console.log(this.user);
    
  }

}
