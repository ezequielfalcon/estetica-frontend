import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {MdDialogRef} from '@angular/material';
import {NotificationsService} from 'angular2-notifications/dist';
import {SpinnerService} from '../../_servicios/spinner.service';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {TratamientosService} from '../../_servicios/datos/tratamientos.service';
import {Router} from '@angular/router';
import {Tratamiento} from '../../_modelos/tratamiento';

@Component({
  selector: 'app-dialogo-turno-medico',
  templateUrl: './dialogo-turno-medico.component.html',
  styleUrls: ['./dialogo-turno-medico.component.css']
})
export class DialogoTurnoMedicoComponent implements OnInit {

  public consultorioId: number;
  public turnoId: number;
  public fecha: string;
  public entreturno: boolean;

  tratamientos: Tratamiento[] = [];
  turno: any = {};
  paciente: any = {};

  constructor(
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoTurnoMedicoComponent>,
    private pacientesService: PacientesService,
    private spinner: SpinnerService,
    private turnosService: TurnosService,
    private tratamientosService: TratamientosService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarTurno();
  }

  cargarTurno(){
    this.turnosService.traerTurno(this.consultorioId, this.turnoId, this.fecha, this.entreturno).subscribe(
      turnoDb => {
        this.turno = turnoDb;
        this.turno.fecha = turnoDb.fecha.substr(0, 10);
        this.traerPaciente(this.turno.id_paciente);
        this.cargarTratamientosAgenda(this.turno.id);
      }, error => {
        if (error.status === 401) {
          this.notificationService.error('Error', 'Sesión expirada!');
          this.router.navigate(['/login']);
        }
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
    );
  }

  traerPaciente(pacienteId: number){
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.paciente = pacienteDb;
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  cargarTratamientosAgenda(agendaId: number) {
    this.tratamientosService.traerAgenda(agendaId).subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
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
