import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SpinnerService} from '../../../_servicios/spinner.service';
import {TurnosService} from '../../../_servicios/datos/turnos.service';
import {TurnoResumenMedico} from '../../../_modelos/turno-resumen-medico';
import {NotificationsService} from 'angular2-notifications/dist';
import {Router} from '@angular/router';
import {Paciente} from '../../../_modelos/paciente';
import {PacientesService} from '../../../_servicios/datos/pacientes.service';
import {DialogoNuevoPacienteService} from '../../../_servicios/dialogos/dialogo-nuevo-paciente.service';
import {DialogoPacientesService} from '../../../_servicios/dialogos/dialogo-pacientes.service';

@Component({
  selector: 'app-turnos-por-paciente',
  templateUrl: './turnos-por-paciente.component.html',
  styleUrls: ['./turnos-por-paciente.component.css']
})
export class TurnosPorPacienteComponent implements OnInit, OnDestroy {

  turnos: TurnoResumenMedico[] = [];
  pacienteSeleccionado = false;
  paciente: Paciente;

  constructor(
    private spinner: SpinnerService,
    private dialogoPacientes: DialogoPacientesService,
    private viewContainerRef: ViewContainerRef,
    private turnosService: TurnosService,
    private notificationService: NotificationsService,
    private router: Router,
    private pacientesService: PacientesService,
    private dialogoNuevoPaciente: DialogoNuevoPacienteService
  ) { }

  ngOnInit() {
    this.spinner.stop();
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  cargarTurnos(idPaciente: number) {
    this.turnosService.traerTurnosPorPaciente(idPaciente).subscribe(turnosDb => {
      this.turnos = turnosDb;
      console.log(turnosDb);
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarPaciente(pacienteId) {
    if (!this.spinner.status) {
      this.spinner.start();
    }
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.paciente = pacienteDb;
      this.pacienteSeleccionado = true;
      this.cargarTurnos(pacienteId);
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
      return;
    });
  }

  seleccionarPaciente() {
    this.spinner.start();
    this.dialogoPacientes.seleccionarPaciente(this.viewContainerRef)
      .subscribe(pacienteSeleccionado => {
        if (pacienteSeleccionado) {
          if (pacienteSeleccionado === -1) {
            this.dialogoNuevoPaciente.crearPaciente(this.viewContainerRef).subscribe(nuevoPacienteSeleccionado => {
              if (nuevoPacienteSeleccionado) {
                this.cargarPaciente(nuevoPacienteSeleccionado);
              }
            });
          } else {
            this.spinner.start();
            this.cargarPaciente(pacienteSeleccionado);
          }
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

  otroPaciente() {
    this.pacienteSeleccionado = false;
    this.seleccionarPaciente();
  }

}
