import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class ConsultoriosService {

  constructor (
    private http: HttpAuthService
  ) {}

  getAll(){
    return this.http.get('/consultorios').map((response: Response) => response.json().datos);
  }

  getById(id: number){
    return this.http.get('/consultorios/' + id).map((response: Response) => response.json().datos);
  }

  post(id: number, nombre: string){
    let body = new URLSearchParams();
    body.set('id', ""+id);
    body.set('nombre', nombre);
    return this.http.post('/consultorios', body).map((response: Response) => response.json());
  }

  put(id: number, nombre: string){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    return this.http.put('/consultorios/' +id, body).map((response: Response) => response.json());
  }

  del(id: number){
    return this.http.del('/consultorios/' +id).map((response: Response) => response.json());
  }

}
