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
    const body = new URLSearchParams();
    body.set('usuario', nombre);
    body.set('clave', pass);
    body.set('rol', rol);
    return this.http.post('/usuarios', body).map((response: Response) => response.json());
  }

  cambiarClave(claveOld: string, claveNew: string) {
    const body = new URLSearchParams();
    body.set('clave_old', claveOld);
    body.set('clave_new', claveNew);
    return this.http.post('/usuario/clave', body).map((response: Response) => response.json());
  }

}
