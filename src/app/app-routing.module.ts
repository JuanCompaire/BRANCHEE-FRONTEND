// src/app/app-routing.module.ts
import { Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'main' , component: MainPageComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
