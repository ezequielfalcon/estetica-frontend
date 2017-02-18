/**
 * Created by falco on 27/1/2017.
 */
import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class ObrasSocialesService{
  constructor (
    private http: HttpAuthService
  ) {}

  getAll(){
    return this.http.get('/obras_sociales').map((response: Response) => response.json().datos);
  }

  get(id: number){
    return this.http.get('/obras_sociales/' + id).map((response: Response) => response.json().datos);
  }

  post(nombre: string){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    return this.http.post('/obras_sociales', body).map((response: Response) => response.json());
  }

  put(id: number, nombre: string){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    return this.http.put('/obras_sociales/' + id, body).map((response: Response) => response.json());
  }

  del(id: number){
    return this.http.del('/obras_sociales/' + id).map((response: Response) => response.json());
  }
}
