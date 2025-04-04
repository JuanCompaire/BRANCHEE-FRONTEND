import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CreateProyectComponent } from './components/proyect/create-proyect/create-proyect.component';
import { ProyectDetailsComponent } from './components/proyect/proyect-details/proyect-details.component';
import { CreateTaskComponent } from './components/task/create-task/create-task.component';
import { DetailsTaskComponent } from './components/task/details-task/details-task.component';
import { AllProjectsComponent } from './components/proyect/all-projects/all-projects.component';
import { AllTasksComponent } from './components/task/all-tasks/all-tasks.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SingUpComponent },
  { path: 'main-page', component: MainPageComponent },
  { path: 'create-proyect', component: CreateProyectComponent },
  { path: 'details-proyect/:id', component: ProyectDetailsComponent},
  { path: 'create-task', component: CreateTaskComponent },
  { path: 'details-task/:id', component: DetailsTaskComponent},
  { path: 'all-projects', component: AllProjectsComponent},
  { path: 'all-tasks', component: AllTasksComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
