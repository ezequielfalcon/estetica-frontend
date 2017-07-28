/**
 * Created by eze on 25/01/17.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {DarkThemeService} from './dark-theme.service';
import {EsMedicoService} from './es-medico.service';


@Injectable()
export class LoginService {
  constructor(
    private http: Http,
    private esMedico: EsMedicoService
  ) {}

  login(usuario: string, clave: string) {
    const bodyForm = {
      usuario: usuario,
      clave: clave
    };
    const apiUrl = 'https://estetica-backend-testing.herokuapp.com/api';
    return this.http.post(apiUrl + '/login', bodyForm)
      .map((response: Response) => {
        sessionStorage.setItem('usuario', usuario);
        sessionStorage.setItem('token', response.json().token);
        const usuarioResponse = response.json().usuario;
        sessionStorage.setItem('rol', usuarioResponse.rol);
        if (usuarioResponse.rol === 'medico') {
          this.esMedico.esMedico = true;
        }
      });
  }

  logout() {
    this.esMedico.esMedico = false;
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
  }
}
