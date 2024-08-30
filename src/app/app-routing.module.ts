import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CreateProyectComponent } from './components/create-proyect/create-proyect.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SingUpComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'create-proyect', component: CreateProyectComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
