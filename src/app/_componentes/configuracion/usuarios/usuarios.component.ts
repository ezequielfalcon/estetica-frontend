import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../../_modelos/usuario";
import {NotificationsService} from "angular2-notifications";
import {UsuariosService} from "../../../_servicios/datos/usuarios.service";

@Component({
  selector: 'app-usuarios',
  templateUrl: 'usuarios.component.html',
  styleUrls: ['usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(
    private notificationsService: NotificationsService,
    private usuariosService: UsuariosService
  ) { }

  usuarios: Usuario[] = [];

  ngOnInit() {
    this.cargarUsuarios();
  }

  private cargarUsuarios(){
    this.usuariosService.traerUsuarios().subscribe(usuariosDb => {
      this.usuarios = usuariosDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationsService.error('Error', mensajeError.mensaje);
    });
  }

}
