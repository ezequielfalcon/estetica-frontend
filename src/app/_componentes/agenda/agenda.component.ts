import {
  Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {Router, ActivatedRoute} from '@angular/router';
import {DialogoTurnoService} from '../../_servicios/dialogos/dialogo-turno.service';
import {Subject} from 'rxjs/Subject';
import {TurnoResumen} from '../../_modelos/turno-resumen';
import {Consultorio} from '../../_modelos/consultorio';
import {ConsultoriosService} from '../../_servicios/datos/consultorios.service';
import {Horario} from '../../_modelos/horario';
import {Anulacion} from '../../_modelos/anulacion';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {DialogoAnulacionesService} from '../../_servicios/dialogos/dialogo-anulaciones.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnDestroy {

  pararActualizarTurnos;
  turnos: TurnoResumen[] = [];
  fechaTurnos: string;
  suscripcionTurnos;
  suscripcionFecha: any;
  consultorios: Consultorio[] = [];
  horarios: Horario[] = [];
  anulaciones: Anulacion[] = [];

  private static fechaHoy() {
    const fechaObject = new Date();
    const mesString = (fechaObject.getMonth() + 1) < 10 ? '0'
      + (fechaObject.getMonth() + 1).toString() : (fechaObject.getMonth() + 1).toString();
    const diaString = fechaObject.getDate() < 10 ? '0' + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + '-' + mesString + '-' + diaString;
  }

  constructor(
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService,
    private consultoriosService: ConsultoriosService,
    private medicosService: MedicosService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dialogoTurno: DialogoTurnoService,
    private dialogoAnulaciones: DialogoAnulacionesService,
    private route: ActivatedRoute
  ) { this.pararActualizarTurnos = new Subject(); }


  ngOnInit() {
    this.suscripcionFecha = this.route.params.subscribe(params => {
      this.fechaTurnos = params['fecha'] || AgendaComponent.fechaHoy();
      this.traerTurnosResumen(this.fechaTurnos);
      this.cargarConsultorios();
      this.cargarHorarios();
      this.cargarAnulaciones(this.fechaTurnos);
    });
  }

  ngOnDestroy() {
    this.pararActualizarTurnos = true;
    this.suscripcionTurnos.unsubscribe();
    this.suscripcionFecha.unsubscribe();
    this.spinner.start();
  }

  cargarAnulaciones(fecha) {
    this.medicosService.verAnulacionesFecha(fecha).subscribe(anulacionesDb => {
      this.anulaciones = anulacionesDb;
      console.log(this.anulaciones);
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

  verAnulacionesDialogo() {
    this.spinner.start();
    this.dialogoAnulaciones.verAnulaciones(this.viewContainerRef, this.fechaTurnos);
  }

  cargarConsultorios() {
    this.consultoriosService.getAll().subscribe(consultoriosDb => {
      this.consultorios = consultoriosDb;
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

  entreturno(consultorioId, turnoId: number) {
    for (const turno of this.turnos){
      if (turno.turno === turnoId && turno.consultorio === consultorioId && turno.entreturno === true) {
        if (turno.atendido === true) {
          return '#009688';
        } else {
          if (turno.presente === true) {
            return '#009688';
          } else {
            return '#3F51B5';
          }
        }
      }
    }
  }

  clickCeldaTurno(consultorioId, turnoId: number) {
    if (this.celdaTurnoValor(consultorioId, turnoId) === '-') {
      if (this.fechaTurnos < AgendaComponent.fechaHoy()) {
        this.notificationSerivce.error('Error', 'Está intentando reservar un turno para una fecha anterior a la actual!');
        return;
      }
      this.router.navigate(['/nuevo-turno/' + consultorioId + '/' + turnoId + '/' + this.fechaTurnos + '/' + false]);
    } else {
      this.spinner.start();
      this.dialogoTurno.verTurno(this.fechaTurnos, consultorioId, turnoId, false, this.viewContainerRef);
    }
  }

  clickEntreturno(consultorioId, turnoId: number) {
    if (this.celdaEntreTurnoValor(consultorioId, turnoId) === '-') {
      if (this.fechaTurnos < AgendaComponent.fechaHoy()) {
        this.notificationSerivce.error('Error', 'Está intentando reservar un entreturno para una fecha anterior a la actual!');
        return;
      }
      this.router.navigate(['/nuevo-turno/' + consultorioId + '/' + turnoId + '/' + this.fechaTurnos + '/' + true]);
    } else {
      this.spinner.start();
      this.dialogoTurno.verTurno(this.fechaTurnos, consultorioId, turnoId, true, this.viewContainerRef);
    }
  }

  celdaEntreTurnoValor(consultorioId, turnoId: number) {
    for (const turno of this.turnos){
      if (turno.turno === turnoId && turno.consultorio === consultorioId && turno.entreturno === true) {
        return turno.apellido;
      }
    }
    return '-';
  }

  celdaTurnoValor(consultorioId, turnoId: number) {
    for (const turno of this.turnos){
      if (turno.turno === turnoId && turno.consultorio === consultorioId && turno.entreturno === false) {
        return turno.apellido;
      }
    }
    return '-';
  }

  celdaTurnoColor(consultorioId, turnoId: number) {
    for (const turno of this.turnos){
      if (turno.turno === turnoId && turno.consultorio === consultorioId && turno.entreturno === false) {
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

  traerTurnosResumen(fecha: string) {
    this.suscripcionTurnos = this.turnosService.traerTurnosResumido(fecha, this.pararActualizarTurnos).subscribe(turnosDb => {
      this.turnos = turnosDb;
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

  cambiarFecha(fecha: string) {
    this.router.navigate(['/redir-agenda/' + fecha]);
  }

}
