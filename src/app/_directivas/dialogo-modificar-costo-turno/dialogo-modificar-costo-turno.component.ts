import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {TurnosService} from '../../_servicios/datos/turnos.service';

@Component({
  selector: 'app-dialogo-modificar-costo-turno',
  templateUrl: './dialogo-modificar-costo-turno.component.html',
  styleUrls: ['./dialogo-modificar-costo-turno.component.css']
})
export class DialogoModificarCostoTurnoComponent implements OnInit {

  public agendaId: number;
  public costoAnterior: number;

  nuevoCosto: any = {};

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private router: Router,
    public dialogRef: MdDialogRef<DialogoModificarCostoTurnoComponent>,
    private turnosService: TurnosService
  ) {
    this.nuevoCosto = 0;
  }

  ngOnInit() {
  }

  modificar() {
    this.spinner.start();
    this.turnosService.modificarCosto(this.agendaId, this.nuevoCosto).subscribe(() => {
      this.dialogRef.close();
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }
}
