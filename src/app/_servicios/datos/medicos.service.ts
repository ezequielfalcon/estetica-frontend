import { Injectable } from '@angular/core';
import {HttpAuthService} from '../http-auth.service';
import {Response, URLSearchParams} from '@angular/http';

@Injectable()
export class MedicosService {

  constructor(
    private http: HttpAuthService
  ) { }

  getAll() {
    return this.http.get('/medicos').map((response: Response) => response.json().datos);
  }

  getById(id: number) {
    return this.http.get('/medicos/' + id).map((response: Response) => response.json().datos);
  }

  post(nombre, apellido, mail, usuario, clave) {
    const body = new URLSearchParams();
    body.set('nombre', nombre);
    body.set('apellido', apellido);
    body.set('mail', mail);
    body.set('usuario', usuario);
    body.set('clave', clave);
    return this.http.post('/medicos', body).map((response: Response) => response.json());
  }

  put(id: number, nombre, apellido, mail) {
    const body = new URLSearchParams();
    body.set('nombre', nombre);
    body.set('apellido', apellido);
    body.set('mail', mail);
    return this.http.put('/medicos/' + id, body).map((response: Response) => response.json());
  }

  del(id: number) {
    return this.http.del('/medicos/' + id).map((response: Response) => response.json());
  }

  verAnulaciones(fecha: string) {
    return this.http.get('/anulaciones/' + fecha).map((response: Response) => response.json().datos);
  }

  nuevaAnulacion(medicoId: number, fecha: string, horarioDesdeId: number, horarioHastaId: number, observaciones: string) {
    const body = new URLSearchParams();
    body.set('id_medico', '' + medicoId);
    body.set('fecha', fecha);
    body.set('desde', '' + horarioDesdeId);
    body.set('hasta', '' + horarioHastaId);
    body.set('observaciones', observaciones);
    return this.http.post('/anulaciones', body).map((response: Response) => response.json());
  }

}
