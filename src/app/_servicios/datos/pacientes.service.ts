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

  buscar(nombre: string, apellido: string, documento: string){
    let body = {
      nombre: nombre,
      apellido: apellido,
      documento: documento
    };
    return this.http.post('/buscar-pacientes', body).map((response: Response) => response.json().datos);
  }

  post(nombre, apellido, documento, telefono, mail, fecha, sexo: string,
       id_os: number, numero_os, domicilio, observaciones, celular) {
    const body = {
      nombre: nombre,
      apellido: apellido,
      documento: documento,
      fecha: fecha,
      telefono: telefono,
      mail: mail,
      sexo: sexo,
      id_os: id_os,
      numero_os: numero_os,
      domicilio: domicilio,
      obs: observaciones,
      celular: celular
    };
    return this.http.post('/pacientes', body).map((response: Response) => response.json());
  }

  put(id: number, nombre, apellido, documento, telefono, mail, fecha, sexo:
    string, id_os: number, numero_os, domicilio, observaciones, celular){
    let body = {
      nombre: nombre,
      apelido: apellido,
      documento: documento,
      fecha: fecha,
      telefono: telefono,
      mail: mail,
      sexo: sexo,
      id_os: id_os,
      numero_os: numero_os,
      domicilio: domicilio,
      obs: observaciones,
      celular: celular
    };
    return this.http.put('/pacientes/' +id, body).map((response: Response) => response.json());
  }

  del(id: number){
    return this.http.del('/pacientes/' +id).map((response: Response) => response.json());
  }
}
