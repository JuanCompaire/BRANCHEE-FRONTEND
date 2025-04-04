import { inject, Injectable } from '@angular/core';
import { environment } from './enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { Proyecto } from '../models/Proyecto';
import { Tarea } from '../models/Tarea';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  http = inject(HttpClient);
  url = environment.url;
  private token: string | null = null;

  constructor() {}
  //USER//

  //SignUp
  signUp(data: Record<string, any>): Observable<any> {
    return this.http.post<any>(`${this.url}api/auth/signUp`, data);
  }
  //Login
  login(data: Record<string, any>): Observable<any> {
    return this.http.post<any>(`${this.url}api/auth/login`, data);
  }

  //Save token session
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token); // Almacena el token en localStorage
  }
  //Get the token session
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  //Log out the user session
  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  //Get info about actual user
  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      return this.http.get<any>(`${this.url}api/auth/me`, { headers });
    }
    return of(null);
  }

  //Get All Users
  getUsers(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}api/auth/getUsers`);
  }

  //Get User by Id
  getUser(id : number): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}api/auth/getUser`,{params: {id}});
  }
  //Search User by letters(input text)
  getUsersByString(searchString : string): Observable<Usuario[]>{
    console.log("El string que se envia para la lista de usuarios es : ",searchString);
    return this.http.get<Usuario[]>(`${this.url}api/auth/getUsersByString`, { params: { string: searchString } });
  }

  //Get Users by Proyect Id
  getUsersByProyectId(id:number): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.url}api/auth/getUsersByProyectId`, { params: {id} });
  }

  //PROYECT//

  //Create Proyect
  createProyect(proyecto: Record<string, any>): Observable<any>{
    return this.http.post<any>(`${this.url}api/proyect/create`,proyecto, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  //Edit Proyect
  editProyect(proyecto: Record<string, any>): Observable<any>{
    return this.http.post<any>(`${this.url}api/proyect/edit`,proyecto);
  }

  //Get Proyects by user Id(this is for main page, to only get name and id info, so is faster and dont need all the info from all projects)
  getProyectosByUserId(id :number): Observable<Proyecto[]>{
    return this.http.get<Proyecto[]>(`${this.url}api/proyect/getProyectsByUserId`, { params: {id} });
  }

  //Get Proyects by user Id All Details (to get all the info about all the projects of an user)
  getProyectosByUserIdAllDetails(id :number): Observable<Proyecto[]>{
    return this.http.get<Proyecto[]>(`${this.url}api/proyect/getProyectosByUserIdAllDetails`, { params: {id} });
  }

  //Get Proyect by Id
  getProyectoById(id :number): Observable<Proyecto>{
    return this.http.get<Proyecto>(`${this.url}api/proyect/getById`, { params: {id} });
  }

  // Get Project Name By Id
  getProyectNameById(id: number): Observable<string> {
    return this.http.get(
      `${this.url}api/proyect/getNameById`,
      {
        params: { id: id },
        responseType: 'text' as const
      }
    );
  }

  //TASK//

  //create Task
  createTask(task: FormData): Observable<Tarea>{
    return this.http.post<Tarea>(`${this.url}api/task/create`, task);
  }

  //Get Task by Id
  getTaskById(id :number): Observable<Tarea>{
    return this.http.get<Tarea>(`${this.url}api/task/getById`, { params: {id} });
  }

  //Edit Task
  editTaskWithChat(formData: FormData): Observable<any>{
    return this.http.post<Tarea>(`${this.url}api/task/edit`, formData);
  }

  //Get Tasks by user Id
  getTasksByUserId(userId : number): Observable<Tarea[]>{
    return this.http.get<Tarea[]>(`${this.url}api/task/getTasksByUserId`, { params: {userId} });
  }

  getTasksByUserIdAllDetails(id : number): Observable<Tarea[]>{
    return this.http.get<Tarea[]>(`${this.url}api/task/getTasksByUserIdAllDetails`, { params: {id} });
  }

}
