import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SubsistemaMedicosService} from '../../_servicios/datos/subsistema-medicos.service';
import {TurnoResumenMedico} from '../../_modelos/turno-resumen-medico';
import {SpinnerService} from '../../_servicios/spinner.service';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications/dist';
import {Consultorio} from '../../_modelos/consultorio';
import {ConsultoriosService} from '../../_servicios/datos/consultorios.service';
import {Horario} from '../../_modelos/horario';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {DialogoTurnoService} from '../../_servicios/dialogos/dialogo-turno.service';

@Component({
  selector: 'app-medico-home',
  templateUrl: './medico-home.component.html',
  styleUrls: ['./medico-home.component.css']
})
export class MedicoHomeComponent implements OnInit, OnDestroy {

  pararActualizarTurnos;
  turnos: TurnoResumenMedico[] = [];
  suscripcionTurnos;
  consultoriosMedico: Consultorio[] = [];
  horariosMedico: Horario[] = [];
  primerCarga = true;

  private static fechaHoy() {
    const fechaObject = new Date();
    const mesString = (fechaObject.getMonth() + 1) < 10 ? '0' +
      (fechaObject.getMonth() + 1).toString() : (fechaObject.getMonth() + 1).toString();
    const diaString = fechaObject.getDate() < 10 ? '0' + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + '-' + mesString + '-' + diaString;
  }

  constructor(
    private subsistemaMedicosService: SubsistemaMedicosService,
    private spinner: SpinnerService,
    private router: Router,
    private notificationsService: NotificationsService,
    private consultoriosService: ConsultoriosService,
    private turnosService: TurnosService,
    private dialogoTurno: DialogoTurnoService,
    private viewContainerRef: ViewContainerRef
  ) { this.pararActualizarTurnos = new Subject(); }

  ngOnInit() {
    this.cargarTurnos();
  }

  ngOnDestroy() {
    this.pararActualizarTurnos = true;
    this.suscripcionTurnos.unsubscribe();
    this.spinner.start();
  }

  cargarConsultorios() {
    this.consultoriosService.getAll().subscribe(consultoriosDb => {
      for (const turnos of this.turnos) {
        for (const consultorio of consultoriosDb) {
          if (consultorio.id === turnos.id_consultorio) {
            if (!this.consultoriosMedico.includes(consultorio)) {
              this.consultoriosMedico.push(consultorio);
            }
          }
        }
      }
      this.consultoriosMedico = this.orderByArray(this.consultoriosMedico, 'id');
      this.primerCarga = false;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationsService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationsService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      for (const turno of this.turnos) {
        for (const horario of horariosDb) {
          if (turno.id_turno === horario.id) {
            if (!this.horariosMedico.includes(horario)) {
              this.horariosMedico.push(horario);
            }
          }
        }
      }
      this.horariosMedico = this.orderByArray(this.horariosMedico, 'id');
      this.primerCarga = false;
      this.spinner.stop();
    });
  }

  cargarTurnos() {
    this.suscripcionTurnos = this.subsistemaMedicosService.verTurnos(MedicoHomeComponent.fechaHoy(), this.pararActualizarTurnos)
      .subscribe(turnosDb => {
        this.turnos = turnosDb;
        if (this.primerCarga) {
          this.cargarConsultorios();
          this.cargarHorarios();
        }
      }, error => {
        if (error.status === 401) {
          this.notificationsService.error('Error', 'Sesión expirada!');
          this.router.navigate(['/login']);
        }
        const body = JSON.parse(error._body);
        this.notificationsService.error('Error', body.mensaje);
        this.spinner.stop();
      });
  }

  clickCeldaTurno(consultorioId, turnoId: number) {
    this.spinner.start();
    if (this.celdaTurnoValor(consultorioId, turnoId) === '-') {
      return;
    }
    this.dialogoTurno.verTurno(MedicoHomeComponent.fechaHoy(), consultorioId, turnoId, false, this.viewContainerRef);
  }

  celdaTurnoValor(consultorioId, turnoId: number) {
    for (const turno of this.turnos){
      if (turno.id_turno === turnoId && turno.id_consultorio === consultorioId && turno.entreturno === false) {
        return turno.paciente;
      }
    }
    return '-';
  }

  celdaTurnoColor(consultorioId, turnoId: number) {
    for (const turno of this.turnos){
      if (turno.id_turno === turnoId && turno.id_consultorio === consultorioId && turno.entreturno === false) {
        if (turno.atendido === true) {
          return 'accent';
        } else {
          if (turno.presente === true) {
            return 'accent';
          } else {
            return 'primary';
          }
        }
      }
    }
    return '';
  }

  orderByArray(values: any[], orderType: any) {
    return values.sort((a, b) => {
      if (a[orderType] < b[orderType]) {
        return -1;
      }
      if (a[orderType] > b[orderType]) {
        return 1;
      }
      return 0;
    });
  }
}
