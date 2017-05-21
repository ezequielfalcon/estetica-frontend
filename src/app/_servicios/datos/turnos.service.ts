import { Injectable } from '@angular/core';
import {HttpAuthService} from '../http-auth.service';
import {Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class TurnosService {

  constructor(
    private http: HttpAuthService
  ) { }

  traerTurnosResumido(fecha: string, pararPolling) {
    return Observable.interval(5000).flatMap(() => {
      return this.http.get('/agenda/' + fecha).map((response: Response) => response.json().datos)
        .takeUntil(pararPolling);
    });
  }

  traerTurno(consultorio, turno: number, fecha: string, entreturno: boolean) {
    return this.http.get('/turnos/' + fecha
      + '/' + consultorio + '/' + turno + '/' + entreturno).map((response: Response) => response.json().datos);
  }

  traerTurnoPorId(turnoId: number) {
    return this.http.get('/turno/' + turnoId).map((response: Response) => response.json().datos);
  }

  traerTurnosPorMedico(medicoId: number, fecha: string) {
    return this.http.get('/turnos/' + fecha + '/' + medicoId).map((response: Response) => response.json().datos);
  }

  nuevoTurno(turnoId: number , pacienteId: number, consultorioId: number, medicoId: number,
             obs, costo, fecha: string, entreturno: boolean) {
    const body = new URLSearchParams();
    body.set('id_turno', '' + turnoId);
    body.set('id_paciente', '' + pacienteId);
    body.set('id_consultorio', '' + consultorioId);
    body.set('id_medico', '' + medicoId);
    body.set('observaciones', obs);
    body.set('costo', costo);
    body.set('fecha', fecha);
    body.set('entreturno', '' + entreturno);
    return this.http.post('/nuevo-turno', body).map((response: Response) => response.json().id);
  }

  agregarTratamiento(agendaId: number, tratamientoId: number) {
    const body = new URLSearchParams();
    body.set('id_agenda', '' + agendaId);
    body.set('id_tratamiento', '' + tratamientoId);
    return this.http.post('/agregar-tratamiento', body).map((response: Response) => response.json());
  }

  confirmarPresencia(agendaId: number, presencia: boolean) {
    const body = new URLSearchParams();
    body.set('id_agenda', '' + agendaId);
    body.set('presente', '' + presencia);
    return this.http.post('/turno-presente', body).map((response: Response) => response.json());
  }

  borrar(turnoId: number) {
    return this.http.del('/turnos/' + turnoId).map((response: Response) => response.json());
  }

  verHorarios() {
    return this.http.get('/horarios').map((response: Response) => response.json().datos);
  }

  modificarCosto(turnoId: number, costo: number, costo2: number, costo3: number) {
    const body = new URLSearchParams();
    body.set('costo', '' + costo);
    body.set('costo2', '' + costo2);
    body.set('costo3', '' + costo3);
    return this.http.put('/agenda/modificar-costo/' + turnoId, body).map((response: Response) => response.json());
  }

}
