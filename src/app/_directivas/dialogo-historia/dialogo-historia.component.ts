import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {NotificationsService} from 'angular2-notifications';
import {MdDialogRef} from '@angular/material';
import {Historia} from '../../_modelos/historia';

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
    this.turnosService.verHistoria(this.idAgenda).subscribe(historiaDb => {
      this.historia.id = historiaDb.id;
      this.historia.id_agenda = this.idAgenda;
      this.historia.comentario = historiaDb.comentario;
      console.log(historiaDb);
      this.cargarFoto();
    }, error => {
      if (error.status === 404) {
        this.notificationService.warn('El turno no tiene detalles cargados');
      } else {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }

  cargarFoto() {
    this.turnosService.verFoto(this.idAgenda).subscribe(fotoDb => {
      if (fotoDb.foto) {
        this.hayFoto = true;
        this.historia.foto = fotoDb.foto;
      }
    }, error => {
      if (error.status !== 404) {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }

  guardarCambios() {
    this.spinner.start();
    this.turnosService.cargarHistoria(this.idAgenda, this.historia.comentario).subscribe(() => {
      if (this.historia.foto) {
        this.turnosService.cargarFoto(this.idAgenda, this.historia.foto).subscribe(() => {

        });
      }
      this.notificationService.success('Historia de turno guardada');
      this.spinner.stop();
    }, error => {
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
