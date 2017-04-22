import {Component, OnInit} from '@angular/core';
import {Anulacion} from '../../_modelos/anulacion';
import {Horario} from '../../_modelos/horario';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {NotificationsService} from 'angular2-notifications/dist';
import {SpinnerService} from '../../_servicios/spinner.service';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialogo-anulaciones',
  templateUrl: './dialogo-anulaciones.component.html',
  styleUrls: ['./dialogo-anulaciones.component.css']
})
export class DialogoAnulacionesComponent implements OnInit {

  public fechaAnulaciones;

  horarios: Horario[] = [];
  anulaciones: Anulacion[] = [];

  constructor(
    public dialogRef: MdDialogRef<DialogoAnulacionesComponent>,
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService,
    private medicosService: MedicosService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarHorarios();
  }

  cargarAnulaciones(fecha) {
    this.medicosService.verAnulaciones(fecha).subscribe( anulacionesDb => {
      this.anulaciones = anulacionesDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationSerivce.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
      this.cargarAnulaciones(this.fechaAnulaciones);
    }, error => {
      if (error.status === 401) {
        this.notificationSerivce.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

}
