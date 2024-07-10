import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    FormsModule  // Añade FormsModule aquí
  ],
  exports: [
    SignUpComponent  // Exporta el componente si es necesario usarlo en otros módulos
  ]
})
export class SignUpModule { }