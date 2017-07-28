import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response, URLSearchParams} from "@angular/http";

@Injectable()
export class CuentaCorrienteService {

  constructor(private http: HttpAuthService) { }

  traerCuenta(pacienteId: number){
    return this.http.get('/cuenta-corriente/' +pacienteId).map((response: Response) => response.json().datos);
  }

  traerSlados(){
    return this.http.get('/cuenta-corriente').map((response: Response) => response.json().datos);
  }

  nuevoMovimiento(pacienteId:number, concepto:string, monto:number){
    let body = {
      id_paciente: pacienteId,
      concepto: concepto,
      monto: monto
    };
    return this.http.post('/cuenta-corriente', body).map((response: Response) => response.json());
  }

}
