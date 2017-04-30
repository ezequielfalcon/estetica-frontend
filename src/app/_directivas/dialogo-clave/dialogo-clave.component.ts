import { Component, OnInit } from '@angular/core';
import {UsuariosService} from '../../_servicios/datos/usuarios.service';
import {NotificationsService} from 'angular2-notifications';
import {SpinnerService} from '../../_servicios/spinner.service';
import {MdDialogRef} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dialogo-clave',
  templateUrl: './dialogo-clave.component.html',
  styleUrls: ['./dialogo-clave.component.css']
})
export class DialogoClaveComponent implements OnInit {

  claveOriginal: string;
  claveNueva: string;
  claveNuevaConfirm: string;

  constructor(
    private usuariosService: UsuariosService,
    private notificationsService: NotificationsService,
    private spinner: SpinnerService,
    public dialogRef: MdDialogRef<DialogoClaveComponent>,
    private router: Router
  ) { }

  ngOnInit() {
  }

  cambiarClave() {
    if (!this.claveNueva || !this.claveNuevaConfirm || !this.claveOriginal) {
      this.notificationsService.alert('Error', 'Debe completar todos los campos!');
      return;
    }
    if (this.claveNueva !== this.claveNuevaConfirm) {
      this.notificationsService.alert('Error', 'Las contraseñas deben ser iguales!');
      return;
    }
    this.spinner.start();
    this.usuariosService.cambiarClave(this.claveOriginal, this.claveNueva).subscribe( () => {
      this.notificationsService.success('OK', 'Clave cambiada correctamente!');
      this.spinner.stop();
      this.router.navigate(['/login']);
    }, error => {
      if (error.status === 401) {
        this.notificationsService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationsService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
