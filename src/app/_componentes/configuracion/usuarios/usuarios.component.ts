import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Usuario} from '../../../_modelos/usuario';
import {NotificationsService} from 'angular2-notifications';
import {UsuariosService} from '../../../_servicios/datos/usuarios.service';
import {Router} from '@angular/router';
import {DialogoClaveService} from '../../../_servicios/dialogos/dialogo-clave.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: 'usuarios.component.html',
  styleUrls: ['usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private notificationService: NotificationsService,
    private usuariosService: UsuariosService,
    private router: Router,
    private cambiarClaveService: DialogoClaveService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  private cargarUsuarios() {
    this.usuariosService.traerUsuarios().subscribe(usuariosDb => {
      this.usuarios = usuariosDb;
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  cambiarClave() {
    this.cambiarClaveService.cambiarClave(this.viewContainerRef);
  }

}
