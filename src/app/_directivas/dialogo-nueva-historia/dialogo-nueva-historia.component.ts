import { Component, OnInit } from '@angular/core';
import {Historia} from '../../_modelos/historia';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialogo-nueva-historia',
  templateUrl: './dialogo-nueva-historia.component.html',
  styleUrls: ['./dialogo-nueva-historia.component.css']
})
export class DialogoNuevaHistoriaComponent implements OnInit {

  public agendaId: number;

  archivoUri: string;
  nuevaHistoria: Historia = new Historia();
  fotoCargada = true;
  cargandoFoto = false;

  constructor(
    private spinner: SpinnerService,
    private turnosService: TurnosService,
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoNuevaHistoriaComponent>
  ) { }

  ngOnInit() {
  }

  guardar() {
    if (this.nuevaHistoria.comentario) {
      this.cargandoFoto = true;
      this.spinner.start();
      this.fotoCargada = false;
      this.turnosService.cargarHistoria(this.agendaId, this.nuevaHistoria.comentario).subscribe(nuevaHistoriaId => {
        if (this.archivoUri) {
          this.turnosService.cargarFoto(nuevaHistoriaId.id, this.archivoUri).subscribe(() => {
            this.notificationService.success('OK', 'Historia cargada correctamente!');
            this.spinner.stop();
            this.cargandoFoto = false;
            this.dialogRef.close(nuevaHistoriaId.id);
          }, error => {
            const body = JSON.parse(error._body);
            this.notificationService.error('Error', body.mensaje);
            this.fotoCargada = true;
            this.cargandoFoto = false;
            this.spinner.stop();
          });
        } else {
          this.notificationService.success('OK', 'Historia cargada correctamente!');
          this.spinner.stop();
          this.cargandoFoto = false;
          this.dialogRef.close(nuevaHistoriaId.id);
        }
      }, error => {
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
        this.fotoCargada = true;
        this.cargandoFoto = false;
        this.spinner.stop();
      });
    }
  }

  archivoSeleccionado($event) {
    this.fotoCargada = false;
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    this.spinner.start();
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();
    myReader.readAsDataURL(file);
    myReader.onloadend = () => {
      this.archivoUri = myReader.result;
      this.spinner.stop();
      this.fotoCargada = true;
    };
  }

}
