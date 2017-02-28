import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";
import {Response} from "@angular/http";

@Injectable()
export class UsuariosService {

  constructor(
    private http: HttpAuthService
  ) { }

  traerUsuarios(){
    return this.http.get('/usuarios').map((response: Response) => response.json().datos);
  }

}
