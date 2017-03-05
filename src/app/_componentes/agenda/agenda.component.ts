import {
  Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {ConsultoriosService} from "../../_servicios/datos/consultorios.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {Medico} from "../../_modelos/medico";
import {Consultorio} from "../../_modelos/consultorio";
import {SpinnerService} from "../../_servicios/spinner.service";
import {NotificationsService} from "angular2-notifications";
import {TurnosService} from "../../_servicios/datos/turnos.service";
import {Turno} from "../../_modelos/turno";
import {Router, ActivatedRoute} from "@angular/router";
import {DialogoTurnoService} from "../../_servicios/dialogos/dialogo-turno.service";
import {Subject} from "rxjs";
import {TurnoResumen} from "../../_modelos/turno-resumen";

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnDestroy {

  pararActualizarTurnos;

  constructor(
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dialogoTurno: DialogoTurnoService,
    private route: ActivatedRoute
  ) { this.pararActualizarTurnos = new Subject(); }

  turnos: TurnoResumen[] = [];
  fechaTurnos: string;
  suscripcionTurnos;
  suscripcionFecha: any;

  ngOnInit() {
    this.suscripcionFecha = this.route.params.subscribe(params => {
      this.fechaTurnos = params['fecha'] || AgendaComponent.fechaHoy();
      this.traerTurnosResumen(this.fechaTurnos);
    });
  }

  ngOnDestroy(){
    this.pararActualizarTurnos = true;
    this.suscripcionTurnos.unsubscribe();
    this.suscripcionFecha.unsubscribe();
    this.spinner.start();
  }

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

  entreturno(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.turno == turnoId && turno.consultorio == consultorioId && turno.entreturno == true){
        return turno.color;
      }
    }
  }

  clickCeldaTurno(consultorioId, turnoId: number){
    if (this.celdaTurnoValor(consultorioId, turnoId) == "Vacío"){
      if (this.fechaTurnos < AgendaComponent.fechaHoy())
      {
        this.notificationSerivce.error("Error", "Está intentando reservar un turno para una fecha anterior a la actual!");
        return;
      }
      this.router.navigate(['/nuevo-turno/' + consultorioId + '/' + turnoId + '/' + this.fechaTurnos + '/' + false])
    }
    else{
      this.spinner.start();
      this.dialogoTurno.verTurno(this.fechaTurnos, consultorioId, turnoId, false, this.viewContainerRef);
    }
  }

  clickEntreturno(consultorioId, turnoId: number){
    if (this.celdaEntreTurnoValor(consultorioId, turnoId) == "Vacío"){
      if (this.fechaTurnos < AgendaComponent.fechaHoy())
      {
        this.notificationSerivce.error("Error", "Está intentando reservar un entreturno para una fecha anterior a la actual!");
        return;
      }
      this.router.navigate(['/nuevo-turno/' + consultorioId + '/' + turnoId + '/' + this.fechaTurnos + '/' + true])
    }
    else{
      this.spinner.start();
      this.dialogoTurno.verTurno(this.fechaTurnos, consultorioId, turnoId, true, this.viewContainerRef);
    }
  }

  celdaEntreTurnoValor(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.turno == turnoId && turno.consultorio == consultorioId && turno.entreturno == true){
        return turno.apellido;
      }
    }
    return "Vacío";
  }

  celdaTurnoValor(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.turno == turnoId && turno.consultorio == consultorioId && turno.entreturno == false){
        return turno.apellido;
      }
    }
    return "Vacío";
  }

  celdaTurnoColor(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.turno == turnoId && turno.consultorio == consultorioId && turno.entreturno == false){
        return turno.color;
      }
    }
    return "";
  }

  traerTurnosResumen(fecha: string){
    this.suscripcionTurnos = this.turnosService.traerTurnosResumido(fecha, this.pararActualizarTurnos).subscribe(turnosDb => {
      this.turnos = turnosDb;
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationSerivce.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cambiarFecha(fecha:string){
    this.router.navigate(['/redir-agenda/' + fecha]);
  }

}
