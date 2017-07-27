import { Injectable } from '@angular/core';
import {HttpAuthService} from '../http-auth.service';
import {Response, URLSearchParams} from '@angular/http';

@Injectable()
export class UsuariosService {

  constructor(
    private http: HttpAuthService
  ) { }

  traerUsuarios() {
    return this.http.get('/usuarios').map((response: Response) => response.json().datos);
  }

  traerRoles() {
    return this.http.get('/roles').map((response: Response) => response.json().datos);
  }

  crearUsuario(nombre: string, pass: string, rol: string) {
    const body = {
      usuario: nombre,
      clave: pass,
      rol: rol
    };
    return this.http.post('/usuarios', body).map((response: Response) => response.json());
  }

  cambiarClave(claveOld: string, claveNew: string) {
    const body = {
      clave_old: claveOld,
      clave_new: claveNew
    };
    return this.http.post('/usuario/clave', body).map((response: Response) => response.json());
  }

}
