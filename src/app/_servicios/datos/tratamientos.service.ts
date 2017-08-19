import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class TratamientosService {

  constructor(private http: HttpAuthService) { }

  getAll(){
    return this.http.get('/tratamientos').map((response: Response) => response.json().datos);
  }

  getById(id: number){
    return this.http.get('/tratamientos/' + id).map((response: Response) => response.json().datos);
  }

  traerAgenda(id_agenda: number){
    return this.http.get('/tratamientos-agenda/' + id_agenda).map((response: Response) => response.json().datos);
  }

  post(nombre, costo: string){
    let body = {
      nombre: nombre,
      costo: costo
    };
    return this.http.post('/tratamientos', body).map((response: Response) => response.json());
  }

  put(id: number, nombre, costo: string){
    let body = {
      nombre: nombre,
      costo: costo
    };
    return this.http.put('/tratamientos/' +id, body).map((response: Response) => response.json());
  }

  del(id: number){
    return this.http.del('/tratamientos/' +id).map((response: Response) => response.json());
  }

  buscar(fechaOld: string, fechaNew: string) {
    return this.http.get('/tratamientos-busqueda/' + fechaOld + '/' + fechaNew).map((response: Response) => response.json().datos);
  }

}
