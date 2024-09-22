import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SingUpComponent } from './components/sing-up/sing-up.component';
import { LoginComponent } from './components/login/login.component';
import { DataService } from './service/data.service';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CreateProyectComponent } from './components/proyect/create-proyect/create-proyect.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProyectDetailsComponent } from './components/proyect/proyect-details/proyect-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SingUpComponent,
    LoginComponent,
    MainPageComponent,
    CreateProyectComponent,
    ProyectDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DataService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
