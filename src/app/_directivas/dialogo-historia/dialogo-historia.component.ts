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
  cargandoFoto = false;
  fotoNueva: string;

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
        this.dialogRef.close(0);
      } else {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }

  cargarFoto() {
    this.cargandoFoto = true;
    this.turnosService.verFoto(this.historia.id).subscribe(fotoDb => {
      if (fotoDb.foto) {
        this.historia.foto = fotoDb.foto;
        this.hayFoto = true;
      }
      this.cargandoFoto = false;
      this.spinner.stop();
    }, error => {
      if (error.status !== 404) {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }

  archivoSeleccionado($event) {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    this.spinner.start();
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();
    myReader.readAsDataURL(file);
    myReader.onloadend = () => {
      this.historia.foto = myReader.result;
      this.spinner.stop();
    };
  }

  guardar() {
    if (this.historia.foto) {
      this.cargandoFoto = true;
      this.hayFoto = false;
      this.turnosService.cargarFoto(this.historia.id, this.historia.foto).subscribe(() => {
        this.cargandoFoto = false;
        this.hayFoto = true;
      });
    }
  }

}
