/**
 * Created by falco on 26/1/2017.
 */
import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class PacientesService {
  constructor (
    private http: HttpAuthService
  ) {}

  getAll(){
    return this.http.get('/pacientes').map((response: Response) => response.json().datos);
  }

  getById(id: number){
    return this.http.get('/pacientes/' + id).map((response: Response) => response.json().datos);
  }

  post(nombre, apellido, documento, telefono, mail, fecha, sexo: string,
       id_os: number, numero_os, domicilio, observaciones){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    body.set('apellido', apellido);
    body.set('documento', documento);
    body.set('fecha', fecha);
    body.set('telefono', telefono);
    body.set('mail', mail);
    body.set('sexo', sexo);
    body.set('id_os', ""+id_os);
    body.set('numero_os', numero_os);
    body.set('domicilio', domicilio);
    body.set('obs', observaciones);
    return this.http.post('/pacientes', body).map((response: Response) => response.json());
  }

  put(id: number, nombre, apellido, documento, telefono, mail, fecha, sexo:
    string, id_os: number, numero_os, domicilio, observaciones){
    let body = new URLSearchParams();
    body.set('nombre', nombre);
    body.set('apellido', apellido);
    body.set('documento', documento);
    body.set('fecha', fecha);
    body.set('telefono', telefono);
    body.set('mail', mail);
    body.set('sexo', sexo);
    body.set('id_os', ""+id_os);
    body.set('numero_os', numero_os);
    body.set('domicilio', domicilio);
    body.set('obs', observaciones);
    return this.http.put('/pacientes/' +id, body).map((response: Response) => response.json());
  }

  del(id: number){
    return this.http.del('/pacientes/' +id).map((response: Response) => response.json());
  }
}
