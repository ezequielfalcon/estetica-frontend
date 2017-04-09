import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response} from "@angular/http";

@Injectable()
export class CuentaCorrienteService {

  constructor(private http: HttpAuthService) { }

  traerCuenta(pacienteId: number){
    return this.http.get('/cuenta-corriente/' +pacienteId).map((response: Response) => response.json().datos);
  }

}
