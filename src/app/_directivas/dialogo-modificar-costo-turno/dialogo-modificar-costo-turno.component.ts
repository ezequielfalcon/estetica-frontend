import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {TurnoResumenMedico} from '../../_modelos/turno-resumen-medico';
import {Horario} from '../../_modelos/horario';

@Component({
  selector: 'app-dialogo-modificar-costo-turno',
  templateUrl: './dialogo-modificar-costo-turno.component.html',
  styleUrls: ['./dialogo-modificar-costo-turno.component.css']
})
export class DialogoModificarCostoTurnoComponent implements OnInit {

  public agendaId: number;
  public costoAnterior: number;

  nuevoCosto: any = {};
  nuevoCosto2: any = {};
  nuevoCosto3: any = {};
  turno: TurnoResumenMedico;
  horarios: Horario[] = [];
  turnoCargado = false;
  asistioCambiado = false;
  asistioCambiado2 = false;

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
    this.cargarHorarios();
    this.cargarTurno(this.agendaId);
  }

  cambiarAsistio() {
    this.asistioCambiado = !this.turno.presente;
    this.asistioCambiado2 = true;
  }

  cargarTurno(agendaId: number) {
    this.turnosService.traerTurnoPorId(agendaId).subscribe(turnoDb => {
      this.turno = turnoDb[0];
      this.turnoCargado = true;
      this.nuevoCosto = this.turno.costo;
      this.nuevoCosto2 = this.turno.costo2;
      this.nuevoCosto3 = this.turno.costo3;
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

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
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

  modificar() {
    this.spinner.start();
    this.turnosService.modificarCosto(this.agendaId, this.nuevoCosto, this.nuevoCosto2, this.nuevoCosto3).subscribe(() => {
      this.dialogRef.close();
      if (this.asistioCambiado2 === true) {
        this.turnosService.confirmarPresencia(this.agendaId, this.asistioCambiado).subscribe(() => {
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
