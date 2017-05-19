import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {SpinnerService} from '../../_servicios/spinner.service';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {Medico} from '../../_modelos/medico';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {Router} from '@angular/router';
import {TurnoResumenMedico} from '../../_modelos/turno-resumen-medico';
import {Horario} from '../../_modelos/horario';
import {Consultorio} from '../../_modelos/consultorio';
import {ConsultoriosService} from '../../_servicios/datos/consultorios.service';
import {DialogoMedicosService} from '../../_servicios/dialogos/dialogo-medicos.service';
import {TratamientosService} from '../../_servicios/datos/tratamientos.service';
import {JsreportService} from '../../_servicios/jsreport.service';
import {TurnoReporte} from '../../_modelos/reportes/turno-reporte';
import {ListadoTurnos} from '../../_modelos/reportes/listado-turnos';
import * as FileSaver from 'file-saver';
import {win32} from 'path';
import {escape} from 'querystring';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit, OnDestroy {

  medicoSeleccionado: Medico;
  medicoSeleccionadoBool = false;
  turnosMedico: TurnoResumenMedico[] = [];
  horarios: Horario[] = [];
  consultorios: Consultorio[] = [];
  fechaTurnos: string;

  private static fechaHoy() {
    const fechaObject = new Date();
    const mesString = (fechaObject.getMonth() + 1) < 10 ? '0'
      + (fechaObject.getMonth() + 1).toString() : (fechaObject.getMonth() + 1).toString();
    const diaString = fechaObject.getDate() < 10 ? '0' + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + '-' + mesString + '-' + diaString;
  }

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private medicosService: MedicosService,
    private turnosService: TurnosService,
    private viewContainerRef: ViewContainerRef,
    private consultoriosService: ConsultoriosService,
    private dialogoMedicos: DialogoMedicosService,
    private tratamientosService: TratamientosService,
    private router: Router,
    private jsreports: JsreportService
  ) { this.fechaTurnos = TurnosComponent.fechaHoy(); }

  ngOnInit() {
    this.cargarHorarios();
    this.cargarConsultorios();
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  imprimir() {
    this.spinner.start();
    const listadoTurnos = new ListadoTurnos();
    listadoTurnos.turnos = [];
    listadoTurnos.medico = this.medicoSeleccionado.nombre + ' ' + this.medicoSeleccionado.apellido;
    listadoTurnos.fecha = this.fechaTurnos;
    for (const turno of this.turnosMedico) {
      const turnoRep = new TurnoReporte();
      turnoRep.paciente = turno.paciente;
      turnoRep.horario = this.convertirHora(turno.id_turno);
      listadoTurnos.turnos.push(turnoRep);
    }
    this.jsreports.generarListadoTurnos(listadoTurnos).subscribe(reporte => {
      this.spinner.stop();
      window.open('data:application/pdf,' + encodeURI(reporte.text()));
    });
  }

  otroMedico() {
    this.medicoSeleccionadoBool = false;
    this.seleccionarMedico();
  }

  cambiarFecha() {
    this.spinner.start();
    this.cargarTurnos(this.medicoSeleccionado.id, this.fechaTurnos);
  }

  cargarTratamientosPorTurno(turnoMedico: TurnoResumenMedico) {
    this.tratamientosService.traerAgenda(turnoMedico.id).subscribe(tratamientosDb => {
      if (tratamientosDb.length === 1 && tratamientosDb[0].nombre === 'Consulta') {
        turnoMedico.tratamientos = ' ';
      } else {
        turnoMedico.tratamientos = '';
        for (const tratamientoDb of tratamientosDb) {
          turnoMedico.tratamientos = turnoMedico.tratamientos + tratamientoDb.nombre + ' ';
        }
      }
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
          this.spinner.start();
          this.cargarMedico(medicoSeleccionado);
          this.cargarTurnos(medicoSeleccionado, this.fechaTurnos);
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

  cargarMedico(medicoId) {
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medicoSeleccionado = medicoDb;
      this.medicoSeleccionadoBool = true;
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

  cargarTurnos(medicoId: number, fecha: string) {
    this.turnosService.traerTurnosPorMedico(medicoId, fecha).subscribe(turnosDb => {
      this.turnosMedico = turnosDb;
      for (const turnoMedico of this.turnosMedico) {
        this.cargarTratamientosPorTurno(turnoMedico);
      }
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

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

  convertirConsultorio(consultorioId: number) {
    for (const consultorio of this.consultorios) {
      if (consultorio.id === consultorioId) {
        return consultorio.nombre;
      }
    }
      return 'error';
  }

}
