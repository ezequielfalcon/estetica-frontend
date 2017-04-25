/**
 * Created by eze on 25/01/17.
 */
import { Injectable } from '@angular/core';
import {Http, Headers, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map'


@Injectable()
export class LoginService{
  constructor(private http: Http){}

  login(usuario: string, clave: string){
    let body = new URLSearchParams();
    body.set('usuario', usuario);
    body.set('clave', clave);
    let headers = new Headers();
    let apiUrl = 'https://estetica-backend.herokuapp.com/api';
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(apiUrl + '/login', body, {headers: headers})
      .map((response: Response) => {
        sessionStorage.setItem('usuario', usuario);
        sessionStorage.setItem('token', response.json().token);
        let usuarioResponse = response.json().usuario;
        sessionStorage.setItem('rol', usuarioResponse.rol);
      });
  }

  static logout() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('rol');
  }
}
