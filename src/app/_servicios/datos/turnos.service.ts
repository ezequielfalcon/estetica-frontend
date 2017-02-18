import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response} from "@angular/http";

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

}
