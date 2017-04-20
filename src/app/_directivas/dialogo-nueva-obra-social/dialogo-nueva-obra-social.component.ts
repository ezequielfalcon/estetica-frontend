import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {ObrasSocialesService} from '../../_servicios/datos/obras-sociales.service';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialogo-nueva-obra-social',
  templateUrl: './dialogo-nueva-obra-social.component.html',
  styleUrls: ['./dialogo-nueva-obra-social.component.css']
})
export class DialogoNuevaObraSocialComponent implements OnInit {

  nuevaOs: any = {};

  constructor(
    private osService: ObrasSocialesService,
    private notificaciones: NotificationsService,
    private router: Router,
    public dialogRef: MdDialogRef<DialogoNuevaObraSocialComponent>,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
  }

  crear() {
    this.osService.post(this.nuevaOs.nombre).subscribe(res => {
      this.notificaciones.success('OK', 'Obra social creada con ID ' + res.id);
      this.dialogRef.close(res.id);
    }, error => {
      if (error.status === 401) {
        this.notificaciones.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificaciones.error('Error', body.mensaje);
      this.spinner.stop();
    } );
  }

}
