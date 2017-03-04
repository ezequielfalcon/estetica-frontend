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
    private notificationService: NotificationsService,
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
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

}
