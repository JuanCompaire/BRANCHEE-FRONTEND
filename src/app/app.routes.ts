import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path:'',
        redirectTo:'/login',
        pathMatch: 'full'
    },
    {
        path:'signup',
        loadComponent:()=>import('./components/sign-up/sign-up.component').then(m=> m.SignUpComponent)
    },
    {
      path:'login',
      loadComponent:()=>import('./components/login/login.component').then(m=> m.LoginComponent)
    },
    {
        path:'main',
        loadComponent:()=>import('./components/main-page/main-page.component').then(m=> m.MainPageComponent)
    }
];
