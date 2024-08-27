import { inject, Injectable } from '@angular/core';
import { environment } from './enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  http = inject(HttpClient);
  url = environment.url;
  private token: string | null = null;

  constructor() {}

  signUp(data: Record<string, any>): Observable<any> {
    return this.http.post<any>(`${this.url}api/auth/signUp`, data);
  }

  login(data: Record<string, any>): Observable<any> {
    return this.http.post<any>(`${this.url}api/auth/login`, data);
  }

  createProyect(data: Record<string ,any>): Observable<any>{
    return this.http.post<any>(`${this.url}api/proyect/create`, data);
  }

  // Método para guardar el token de sesión
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token); // Almacena el token en localStorage
  }

  // Método para obtener el token de sesión
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  // Método para obtener la información del usuario autenticado
  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any>(`${this.url}api/auth/me`, { headers });
    }
    return of(null); // Si no hay token, retorna null
  }

  //Metodo para obtener todos los usuarios que hay, es para probar lo del excel
  getUsers(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}api/auth/getUsers`);
  }

  // Método para cerrar sesión
  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}
