import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routes } from './app/app-routing.module';
import { SignUpComponent } from './app/components/sign-up/sign-up.component';
import { SignUpModule } from './app/components/sign-up/sign-up.module';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
