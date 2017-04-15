import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response} from "@angular/http";

@Injectable()
export class SubsistemaMedicosService {

  constructor(private http: HttpAuthService) { }

  verTurnos(fecha: string){
    return this.http.get('/sub-medicos/turnos/' + fecha).map((response: Response) => response.json().datos);
  }

  turnoAtendido(turnoId: number){
    let body = new URLSearchParams();
    return this.http.put('/sub-medicos/turnos/' + turnoId, body).map((response: Response) => response.json());
  }

}
