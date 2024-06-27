import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];

@NgModule({
    imports: [
      BrowserModule,
      RouterModule.forRoot(routes),
      AppComponent, // Importa el componente autónomo
      LoginComponent, // Importa el componente autónomo
      SignUpComponent, // Importa el componente autónomo
    ],
    providers: [],
    bootstrap: []
  })
  export class AppModule { }