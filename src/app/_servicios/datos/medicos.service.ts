import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class MedicosService {

  constructor(
    private http: HttpAuthService
  ) { }

  getAll(){
    return this.http.get('/medicos').map((response: Response) => response.json().datos);
  }

  getById(id: number){
    return this.http.get('/medicos/' + id).map((response: Response) => response.json().datos);
  }

  post(nombre, apellido, mail){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    body.set('apellido', apellido);
    body.set('mail', mail);
    return this.http.post('/medicos', body).map((response: Response) => response.json());
  }

  put(id: number, nombre, apellido, mail){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    body.set('apellido', apellido);
    body.set('mail', mail);
    return this.http.put('/medicos/' +id, body).map((response: Response) => response.json());
  }

  del(id:number){
    return this.http.del('/medicos/' +id).map((response: Response) => response.json());
  }

}
