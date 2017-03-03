import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class TurnosService {

  constructor(
    private http: HttpAuthService
  ) { }



  traerConfig(){
    return this.http.get('/configuracion-turnos').map((response: Response) => response.json().datos);
  }

  traerTurnos(fecha: string, pararPolling){
    return Observable.interval(5000).flatMap(() => {
      return this.http.get('/turnos/' + fecha).map((response: Response) => response.json().datos)
        .takeUntil(pararPolling);
    });
  }

  traerTurnosResumido(fecha: string, pararPolling){
    return Observable.interval(5000).flatMap(() => {
      return this.http.get('/agenda/' + fecha).map((response: Response) => response.json().datos)
        .takeUntil(pararPolling);
    });
  }

  traerTurno(consultorio, turno: number, fecha: string, entreturno: boolean){
    return this.http.get('/turnos/' + fecha
      + '/' + consultorio + '/' + turno + '/' + entreturno).map((response: Response) => response.json().datos);
  }

  traerTurnosPorMedico(medicoId: number, fecha: string){
    return this.http.get('/turnos/' + fecha + '/' + medicoId).map((response: Response) => response.json().datos);
  }

  nuevoTurno(turnoId:number , pacienteId:number, consultorioId:number, medicoId:number,
             obs, costo, fecha:string, entreturno: boolean){
    let body = new URLSearchParams();
    body.set('id_turno', ""+turnoId);
    body.set('id_paciente', ""+pacienteId);
    body.set('id_consultorio', ""+consultorioId);
    body.set('id_medico', ""+medicoId);
    body.set('observaciones', obs);
    body.set('costo', costo);
    body.set('fecha', fecha);
    body.set('entreturno', ""+entreturno);
    return this.http.post('/nuevo-turno', body).map((response: Response) => response.json().id);
  }

  agregarTratamiento(agendaId: number, tratamientoId: number){
    let body = new URLSearchParams();
    body.set('id_agenda', ""+agendaId);
    body.set('id_tratamiento', ""+tratamientoId);
    return this.http.post('/agregar-tratamiento', body).map((response: Response) => response.json());
  }

}
