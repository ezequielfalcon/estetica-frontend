import { Injectable } from '@angular/core';
import {HttpAuthService} from "../http-auth.service";

@Injectable()
export class UsuariosService {

  constructor(
    private http: HttpAuthService
  ) { }

}
