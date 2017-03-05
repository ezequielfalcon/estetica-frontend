import { Component, OnInit } from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {UsuariosService} from "../../../../_servicios/datos/usuarios.service";
import {Rol} from "../../../../_modelos/rol";
import {SpinnerService} from "../../../../_servicios/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  constructor(
    private notificationService: NotificationsService,
    private usuariosService: UsuariosService,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  nuevoUsuario: any = {};
  roles: Rol[] = [];
  returnUrl: string;

  ngOnInit() {
    this.cargarRoles();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/configuracion/usuarios';
  }

  cargarRoles(){
    this.usuariosService.traerRoles().subscribe(rolesDb => {
      this.roles = rolesDb;
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  cancelar(){
    this.router.navigate([this.returnUrl]);
  }

  crear(){
    this.spinner.start();
    if (this.nuevoUsuario.pass1 != this.nuevoUsuario.pass2){
      this.notificationService.alert("Error","Las contraseñas deben coincidir!");
      this.spinner.stop();
    }
    else{
      this.usuariosService.crearUsuario(this.nuevoUsuario.nombre, this.nuevoUsuario.pass1, this.nuevoUsuario.rol)
        .subscribe(() => {
        this.notificationService.success("OK","Usuario creado!");
        this.router.navigate([this.returnUrl]);
      });
    }
  }

}
