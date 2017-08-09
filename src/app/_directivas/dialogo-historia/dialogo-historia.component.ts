import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {NotificationsService} from 'angular2-notifications';
import {MdDialogRef} from '@angular/material';
import {Historia} from '../../_modelos/historia';
import {ConfirmService} from '../../_servicios/confirm.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-dialogo-historia',
  templateUrl: './dialogo-historia.component.html',
  styleUrls: ['./dialogo-historia.component.css']
})
export class DialogoHistoriaComponent implements OnInit {

  public idAgenda: number;
  historia: Historia = new Historia();
  hayFoto = false;

  constructor(
    private spinner: SpinnerService,
    private turnosService: TurnosService,
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoHistoriaComponent>
  ) { }

  ngOnInit() {
    this.cargarHistoria();
  }

  cargarHistoria() {
    this.spinner.start();
    this.turnosService.verHistoria(this.idAgenda).subscribe(historiaDb => {
      this.historia.id = historiaDb.id;
      this.historia.id_agenda = this.idAgenda;
      this.historia.comentario = historiaDb.comentario;
      this.cargarFoto();
    }, error => {
      if (error.status === 404) {
        this.notificationService.warn('Error', 'El turno no tiene detalles cargados');
        this.dialogRef.close(0);
      } else {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }

  cargarFoto() {
    this.turnosService.verFoto(this.historia.id).subscribe(fotoDb => {
      if (fotoDb.foto) {
        this.historia.foto = fotoDb.foto;
        this.hayFoto = true;
      }
      this.spinner.stop();
    }, error => {
      if (error.status !== 404) {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }

}
