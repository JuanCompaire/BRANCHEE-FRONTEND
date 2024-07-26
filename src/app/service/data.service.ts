import { inject, Injectable } from '@angular/core';
import { HttpClient,} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './enviroment';
import { FormsModule } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  //este http hace que la pagina se quede en blanco
  http = inject(HttpClient)
  //url backend for make the endpoint
  url = environment.url

  constructor() { }
//send the user data to the backend for the signup
  signUp(data: Record<string, any>): Observable<any>{
    return this.http.post<any>(this.url+"signup",data);
  }
//Login Method(check if the user exists)
  login(data:Record<string,any>): Observable<any>{
    return this.http.post<any>(this.url+"login",data);
  }

}
