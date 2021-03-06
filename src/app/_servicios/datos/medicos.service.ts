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
    const body = {
      nombre: nombre,
      apellido: apellido,
      mail: mail,
      usuario: usuario,
      clave: clave
    };
    return this.http.post('/medicos', body).map((response: Response) => response.json());
  }

  put(id: number, nombre, apellido, mail) {
    const body = {
      nombre: nombre,
      apellido: apellido,
      mail: mail
    };
    return this.http.put('/medicos/' + id, body).map((response: Response) => response.json());
  }

  del(id: number) {
    return this.http.del('/medicos/' + id).map((response: Response) => response.json());
  }

  verAnulacionesFecha(fecha: string) {
    return this.http.get('/anulaciones/' + fecha).map((response: Response) => response.json().datos);
  }

  verAnulaciones() {
    return this.http.get('/anulaciones').map((response: Response) => response.json().datos);
  }

  nuevaAnulacion(medicoId: number, fecha: string, horarioDesdeId: number, horarioHastaId: number, observaciones: string) {
    const body = {
      id_medico: medicoId,
      fecha: fecha,
      desde: horarioDesdeId,
      hasta: horarioHastaId,
      observaciones: observaciones
    };
    return this.http.post('/anulaciones', body).map((response: Response) => response.json());
  }

  borrarAnulacion(anulacionId: number) {
    return this.http.del('/anulaciones/' + anulacionId).map((response: Response) => response.json());
  }

}
