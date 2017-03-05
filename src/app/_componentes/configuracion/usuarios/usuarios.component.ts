import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../../_modelos/usuario";
import {NotificationsService} from "angular2-notifications";
import {UsuariosService} from "../../../_servicios/datos/usuarios.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-usuarios',
  templateUrl: 'usuarios.component.html',
  styleUrls: ['usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor(
    private notificationService: NotificationsService,
    private usuariosService: UsuariosService,
    private router: Router
  ) { }

  usuarios: Usuario[] = [];

  ngOnInit() {
    this.cargarUsuarios();
  }

  private cargarUsuarios(){
    this.usuariosService.traerUsuarios().subscribe(usuariosDb => {
      this.usuarios = usuariosDb;
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

}
