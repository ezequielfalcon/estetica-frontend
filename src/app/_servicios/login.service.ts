/**
 * Created by eze on 25/01/17.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map'
import {DarkThemeService} from './dark-theme.service';
import {EsMedicoService} from './es-medico.service';


@Injectable()
export class LoginService{
  constructor(
    private http: Http,
    private esMedico: EsMedicoService
  ){}

  login(usuario: string, clave: string){
    let body = new URLSearchParams();
    body.set('usuario', usuario);
    body.set('clave', clave);
    let headers = new Headers();
    let apiUrl = 'https://estetica-backend-testing.herokuapp.com/api';
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(apiUrl + '/login', body, {headers: headers})
      .map((response: Response) => {
        sessionStorage.setItem('usuario', usuario);
        sessionStorage.setItem('token', response.json().token);
        let usuarioResponse = response.json().usuario;
        sessionStorage.setItem('rol', usuarioResponse.rol);
        if (usuarioResponse.rol == 'medico') this.esMedico.esMedico = true;
      });
  }

  logout() {
    this.esMedico.esMedico = false;
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
  }
}
