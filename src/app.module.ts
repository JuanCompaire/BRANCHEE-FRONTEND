// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { AppComponent } from './app/app.component';
import { SignUpModule } from './app/components/sign-up/sign-up.module';
@NgModule({
    imports: [
      BrowserModule,
      SignUpModule,
      AppComponent // Importa AppComponent
    ],
    bootstrap: [AppComponent] // Arranca con AppComponent
  })
  export class AppModule { }