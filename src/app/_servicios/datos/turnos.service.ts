import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class TurnosService {

  constructor(
    private http: HttpAuthService
  ) { }

  traerConfig(){
    return this.http.get('/configuracion-turnos').map((response: Response) => response.json().datos);
  }

  traerTurnos(fecha: string){
    return this.http.get('/turnos/' + fecha).map((response: Response) => response.json().datos);
  }

  traerTurno(consultorio, turno: number, fecha: string){
    return this.http.get('/turnos/' + +consultorio
      + '/' + +turno + '/' + fecha).map((response: Response) => response.json().datos);
  }

  nuevoTurno(turnoId:number , pacienteId:number, consultorioId:number, medicoId:number, tratamientoId: number,
             obs, costo, fecha:string, entreturno: boolean){
    let body = new URLSearchParams();
    body.set('id_turno', ""+turnoId);
    body.set('id_paciente', ""+pacienteId);
    body.set('id_consultorio', ""+consultorioId);
    body.set('id_medico', ""+medicoId);
    body.set('id_tratamiento', ""+tratamientoId);
    body.set('observaciones', obs);
    body.set('costo', costo);
    body.set('fecha', fecha);
    body.set('entreturno', ""+entreturno);
    return this.http.post('/nuevo-turno', body).map((response: Response) => response.json());
  }

}
