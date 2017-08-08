import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SpinnerService} from '../../../_servicios/spinner.service';
import {TurnosService} from '../../../_servicios/datos/turnos.service';
import {TurnoResumenMedico} from '../../../_modelos/turno-resumen-medico';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {Paciente} from '../../../_modelos/paciente';
import {PacientesService} from '../../../_servicios/datos/pacientes.service';
import {DialogoNuevoPacienteService} from '../../../_servicios/dialogos/dialogo-nuevo-paciente.service';
import {DialogoPacientesService} from '../../../_servicios/dialogos/dialogo-pacientes.service';
import {Medico} from '../../../_modelos/medico';
import {MedicosService} from '../../../_servicios/datos/medicos.service';
import {Horario} from '../../../_modelos/horario';
import {Consultorio} from '../../../_modelos/consultorio';
import {ConsultoriosService} from '../../../_servicios/datos/consultorios.service';
import {DialogoTurnoService} from '../../../_servicios/dialogos/dialogo-turno.service';
import {DialogoHistoriaService} from '../../../_servicios/dialogos/dialogo-historia.service';

@Component({
  selector: 'app-turnos-por-paciente',
  templateUrl: './turnos-por-paciente.component.html',
  styleUrls: ['./turnos-por-paciente.component.css']
})
export class TurnosPorPacienteComponent implements OnInit, OnDestroy {

  turnos: TurnoResumenMedico[] = [];
  turnosAnteriores: TurnoResumenMedico[] = [];
  turnosFuturos: TurnoResumenMedico[] = [];
  consultorios: Consultorio[] = [];
  horarios: Horario[] = [];
  medicos: Medico[] = [];
  pacienteSeleccionado = false;
  paciente: Paciente;

  columnas: any = [
    {nombre: 'Fecha', id: 'fecha'},
    {nombre: 'Horario', id: 'id_turno'},
    {nombre: 'Médico', id: 'id_medico'},
    {nombre: 'Consultorio', id: 'id_consultorio'},
    {nombre: 'Dado por:', id: 'usuario'}
  ];

  private static fechaHoy() {
    const fechaObject = new Date();
    const mesString = (fechaObject.getMonth() + 1) < 10 ? '0'
      + (fechaObject.getMonth() + 1).toString() : (fechaObject.getMonth() + 1).toString();
    const diaString = fechaObject.getDate() < 10 ? '0' + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + '-' + mesString + '-' + diaString;
  }

  constructor(
    private spinner: SpinnerService,
    private dialogoPacientes: DialogoPacientesService,
    private viewContainerRef: ViewContainerRef,
    private turnosService: TurnosService,
    private notificationService: NotificationsService,
    private router: Router,
    private pacientesService: PacientesService,
    private dialogoNuevoPaciente: DialogoNuevoPacienteService,
    private medicosService: MedicosService,
    private consultoriosService: ConsultoriosService,
    private dialogoTurno: DialogoTurnoService,
    private historiaDialog: DialogoHistoriaService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
    this.cargarHorarios();
    this.cargarConsultorios();
  }

  ngOnDestroy() {
    this.spinner.start();
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

  cargarConsultorios() {
    this.consultoriosService.getAll().subscribe(consultoriosDb => {
      this.consultorios = consultoriosDb;
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

  cargarTurnos(idPaciente: number) {
    this.turnosService.traerTurnosPorPaciente(idPaciente).subscribe(turnosDb => {
      this.turnos = turnosDb;
      for (const turno of this.turnos) {
        turno.fecha = turno.fecha.substr(0, 10);
      }
      this.separarTurnosPorFecha(this.turnos);
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

  detalleTurno(agendaId: number) {
    this.dialogoTurno.verTurnoId(agendaId, this.viewContainerRef);
  }

  cargarMedicos() {
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
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

  separarTurnosPorFecha(turnos: TurnoResumenMedico[]) {
    this.turnosAnteriores = [];
    this.turnosFuturos = [];
    for (const turno of turnos) {
      const fechaTurno = new Date(turno.fecha).getTime();
      const fechaActual = new Date(TurnosPorPacienteComponent.fechaHoy()).getTime();
      if (fechaTurno < fechaActual) {
        this.turnosAnteriores.push(turno);
      } else {
        this.turnosFuturos.push(turno);
      }
    }
  }

  buscarMedico(medicoId: number) {
    for (const medico of this.medicos) {
      if (medico.id === medicoId) {
        return medico.nombre + ' ' + medico.apellido;
      }
    }
    return 'error'
  }

  buscarConsultorio(consultorioId: number) {
    for (const consultorio of this.consultorios) {
      if (consultorio.id === consultorioId) {
        return consultorio.nombre;
      }
    }
    return 'error'
  }

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

  clickHistoria(agendaId: number) {
    this.historiaDialog.verHistoria(agendaId, this.viewContainerRef).subscribe(resDialogo => {
      if (resDialogo === 0) {

      }
    });
  }
}
