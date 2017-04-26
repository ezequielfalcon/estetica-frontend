import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Tratamiento} from '../../_modelos/tratamiento';
import {Medico} from '../../_modelos/medico';
import {Paciente} from '../../_modelos/paciente';
import {Horario} from '../../_modelos/horario';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {NotificationsService} from 'angular2-notifications';
import {SpinnerService} from '../../_servicios/spinner.service';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {Router} from '@angular/router';
import {DialogoPacientesService} from '../../_servicios/dialogos/dialogo-pacientes.service';
import {DialogoMedicosService} from '../../_servicios/dialogos/dialogo-medicos.service';
import {DialogoNuevoPacienteService} from '../../_servicios/dialogos/dialogo-nuevo-paciente.service';
import {TratamientosService} from '../../_servicios/datos/tratamientos.service';
import {DialogoTratamientosService} from '../../_servicios/dialogos/dialogo-tratamientos.service';
import {MdDialogRef} from '@angular/material';
import {DialogoNuevoPacienteRapidoService} from "../../_servicios/dialogos/dialogo-nuevo-paciente-rapido.service";

@Component({
  selector: 'app-dialogo-nuevo-turno',
  templateUrl: './dialogo-nuevo-turno.component.html',
  styleUrls: ['./dialogo-nuevo-turno.component.css']
})
export class DialogoNuevoTurnoComponent implements OnInit {

  public turnoId: number;
  public consultorioId: number;
  public fechaTurno: string;
  public entreturno: boolean;

  tratamientos: Tratamiento[] = [];
  pacienteSeleccionado: Paciente;
  medicoSelecionado: Medico;
  tratamientosSeleccionados: Tratamiento[] = [];
  horarios: Horario[] = [];
  horarioString: string;
  nuevoTurno: any = {};
  adicionalesTurno = 0;

  constructor(
    private medicosService: MedicosService,
    private spinner: SpinnerService,
    private notificationService: NotificationsService,
    private turnosService: TurnosService,
    private pacientesService: PacientesService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dialogoMedicos: DialogoMedicosService,
    private tratamientosService: TratamientosService,
    private dialogoTratamientos: DialogoTratamientosService,
    public dialogRef: MdDialogRef<DialogoNuevoTurnoComponent>,
    private dialogoNuevoPacRapido: DialogoNuevoPacienteRapidoService
  ) {  }

  ngOnInit() {
    this.cargarHorarios();
    this.cargarTratamientos();
    this.nuevoTurno.turnoId = this.turnoId;
    this.nuevoTurno.consultorioId = this.consultorioId;
    this.nuevoTurno.fechaTurno = this.fechaTurno;
    this.nuevoTurno.entreturno = this.entreturno;
    this.nuevoTurno.costoTurno = 0;
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
      this.horarioString = this.convertirHora(this.turnoId);
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

  cargarPaciente(pacienteId) {
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.pacienteSeleccionado = pacienteDb;
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

  cargarTratamientos() {
    this.tratamientosService.getAll().subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
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

  seleccionarPaciente() {
    this.spinner.start();
    this.dialogoNuevoPacRapido.seleccionarCearPaciente(this.viewContainerRef)
      .subscribe(pacienteSeleccionado => {
        if (pacienteSeleccionado) {
          this.cargarPaciente(pacienteSeleccionado);
        }
      });
  }

  cargarMedico(medicoId) {
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medicoSelecionado = medicoDb;
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

  seleccionarMedico() {
    this.spinner.start();
    this.dialogoMedicos.seleccionarMedico(this.viewContainerRef)
      .subscribe(medicoSeleccionado => {
        if (medicoSeleccionado) {
          this.cargarMedico(medicoSeleccionado);
        }
      });
  }

  agregarTratamiento() {
    this.spinner.start();
    this.dialogoTratamientos.seleccionarTratamiento(this.viewContainerRef)
      .subscribe(tratamientoSeleccionadoDb => {
        for (const tratamiento of this.tratamientos){
          if (tratamiento.id === tratamientoSeleccionadoDb) {
            for (const tratamientosAgregados of this.tratamientosSeleccionados){
              if (tratamientosAgregados.id === tratamientoSeleccionadoDb) {
                this.notificationService.alert('Advertencia', 'Ya agregó ese tratamiento a al turno!');
                return;
              }
            }
            this.tratamientosSeleccionados.push(tratamiento);
            this.nuevoTurno.costoTurno = this.nuevoTurno.costoTurno + +tratamiento.costo;
          }
        }
      });
  }

  sacarTratamiento(tratamientoId: number) {
    for (const tratamiento of this.tratamientosSeleccionados){
      if (tratamiento.id === tratamientoId) {
        const indiceElemento = this.tratamientosSeleccionados.indexOf(tratamiento);
        this.tratamientosSeleccionados.splice(indiceElemento, 1);
        this.nuevoTurno.costoTurno = this.nuevoTurno.costoTurno - +tratamiento.costo;
      }
    }
  }

  crear() {
    this.spinner.start();
    if (!this.nuevoTurno.observaciones) {
      this.nuevoTurno.observaciones = ' ';
    }
    if (!this.medicoSelecionado) {
        this.notificationService.alert('Error', 'Debe seleccionar un Médico.');
        return;
    }
    if (!this.pacienteSeleccionado) {
        this.notificationService.alert('Error', 'Debe seleccionar un Paciente.');
        return;
    }
    switch (this.adicionalesTurno){
      case 0:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, this.entreturno, true);
        break;
      case 1:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, true, true);
        this.crearTurnoAtom(this.nuevoTurno.turnoId, false, false);
        break;
      case 2:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, true, true);
        this.crearTurnoAtom(this.nuevoTurno.turnoId, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, false, false);
        break;
      case 3:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, true, true);
        this.crearTurnoAtom(this.nuevoTurno.turnoId, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, false, false);
        break;
      case 4:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, true, true);
        this.crearTurnoAtom(this.nuevoTurno.turnoId, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 3, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 3, false, false);
        break;
      case 5:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, true, true);
        this.crearTurnoAtom(this.nuevoTurno.turnoId, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 3, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 3, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 4, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 4, false, false);
        break;
      case 6:
        this.crearTurnoAtom(this.nuevoTurno.turnoId, true, true);
        this.crearTurnoAtom(this.nuevoTurno.turnoId, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 1, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 2, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 3, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 3, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 4, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 4, false, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 5, true, false);
        this.crearTurnoAtom(this.nuevoTurno.turnoId + 5, false, false);
        break;
    }
  }

  crearTurnoAtom(horarioId: number, entreturnoMas: boolean, primero: boolean) {
    this.turnosService.nuevoTurno(horarioId,
      this.pacienteSeleccionado.id, this.nuevoTurno.consultorioId,
      this.medicoSelecionado.id,
      this.nuevoTurno.observaciones, this.nuevoTurno.costoTurno,
      this.nuevoTurno.fechaTurno, entreturnoMas).subscribe((agendaId) => {
      for (const tratamientosSeleccionadosList of this.tratamientosSeleccionados){
        this.turnosService.agregarTratamiento(agendaId, tratamientosSeleccionadosList.id).subscribe(() => {
        }, error => {
          if (error.status === 401) {
            this.notificationService.error('Error', 'Sesión expirada!');
            this.router.navigate(['/login']);
          }
          const body = JSON.parse(error._body);
          if (primero) {
            this.notificationService.error('Error', body.mensaje);
          }
          this.spinner.stop();
          return;
        });
      }
      if (primero) {
        this.notificationService.success('OK', 'Nuevo turno creado con ID: ' + agendaId);
      }
      this.dialogRef.close();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      if (primero) {
        this.notificationService.error('Error', body.mensaje);
      }
      this.spinner.stop();
    });
  }
}
