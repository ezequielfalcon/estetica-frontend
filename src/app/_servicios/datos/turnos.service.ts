import { Injectable } from '@angular/core';
import {HttpAuthService} from '../http-auth.service';
import {Response} from '@angular/http';
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

  traerTurnosListadoNew(medicoId: number, fecha: string) {
    return this.http.get('/listado-turnos/' + fecha + '/' + medicoId).map((response: Response) => response.json().datos);
  }

  traerTurnosPorPaciente(pacienteId: number) {
    return this.http.get('/turnos-paciente/' + pacienteId).map((response: Response) => response.json().datos);
  }

  nuevoTurno(turnoId: number , pacienteId: number, consultorioId: number, medicoId: number,
             obs, costo, fecha: string, entreturno: boolean) {
    const body = {
      id_turno: turnoId,
      id_paciente: pacienteId,
      id_consultorio: consultorioId,
      id_medico: medicoId,
      observaciones: obs,
      costo: costo,
      fecha: fecha,
      entreturno: entreturno
    };
    return this.http.post('/nuevo-turno', body).map((response: Response) => response.json().id);
  }

  agregarTratamiento(agendaId: number, tratamientoId: number) {
    const body = {
      id_agenda: agendaId,
      id_tratamiento: tratamientoId
    };
    return this.http.post('/agregar-tratamiento', body).map((response: Response) => response.json());
  }

  confirmarPresencia(agendaId: number, presencia: boolean) {
    const body = {
      id_agenda: agendaId,
      presente: presencia
    };
    return this.http.post('/turno-presente', body).map((response: Response) => response.json());
  }

  borrar(turnoId: number) {
    return this.http.del('/turnos/' + turnoId).map((response: Response) => response.json());
  }

  verHorarios() {
    return this.http.get('/horarios').map((response: Response) => response.json().datos);
  }

  modificarCosto(turnoId: number, costo: number, costo2: number, costo3: number) {
    const body = {
      costo: costo,
      costo2: costo2,
      costo3: costo3
    };
    return this.http.put('/agenda/modificar-costo/' + turnoId, body).map((response: Response) => response.json());
  }

  verHistoria(agendaId: number) {
    return this.http.get('/historia/' + agendaId).map((response: Response) => response.json().datos);
  }

  verFoto(historiaId: number) {
    return this.http.get('/fotos/' + historiaId).map((response: Response) => response.json());
  }

  cargarHistoria(agendaId: number, comentarios: string) {
    const body = {
      id_agenda: agendaId,
      comentarios: comentarios
    };
    return this.http.post('/historia', body).map((response: Response) => response.json());
  }

  cargarFoto(agendaId: number, foto: string) {
    const body = {
      foto_uri: foto
    };
    return this.http.put('/fotos/' + agendaId, body).map((response: Response) => response.json());
  }

  listadoTurnosMedicoRes(medicoId: number, fechaOld: string, fechaNew: string) {
    return this.http.get('/turnos-medico/' + medicoId + '/' + fechaOld + '/' + fechaNew)
      .map((response: Response) => response.json().datos);
  }

}
