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

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnDestroy {

  pararActualizarTurnos;

  constructor(
    private consultoriosService: ConsultoriosService,
    private medicosService: MedicosService,
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dialogoTurno: DialogoTurnoService,
    private route: ActivatedRoute
  ) { this.pararActualizarTurnos = new Subject(); }

  medicos: Medico[] = [];
  consultorios: Consultorio[] = [];
  turnos: Turno[] = [];
  configuracion: any = {};
  fechaTurnos: string;
  suscripcionTurnos;
  suscripcionFecha: any;

  ngOnInit() {
    this.suscripcionFecha = this.route.params.subscribe(params => {
      this.fechaTurnos = params['fecha'] || AgendaComponent.fechaHoy();
      this.cargarConsuls();
      this.cargarMedicos();
      this.traerConfigTurnos();
      this.traerTurnos(this.fechaTurnos);
    });
  }

  ngOnDestroy(){
    this.pararActualizarTurnos = true;
    this.suscripcionTurnos.unsubscribe();
    this.suscripcionFecha.unsubscribe();
    this.spinner.start();
  }

  traerConfigTurnos(){
    this.turnosService.traerConfig().subscribe(configDb => {
      this.configuracion = configDb;
      this.configuracion.fecha = this.configuracion.fecha.substr(0, 10);
      this.configuracion.fechaActual = AgendaComponent.fechaHoy();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
    });
  }

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

  cargarConsuls(){
    this.consultoriosService.getAll().subscribe(consulsDb => {
      this.consultorios = consulsDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  entreturno(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.id_turno == turnoId && turno.id_consultorio == consultorioId && turno.entreturno == true){
        return this.celdaTurnoColor(consultorioId, turnoId);
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
      this.router.navigate(['/nuevo-turno/' + consultorioId + '/' + turnoId + '/' + this.configuracion.fechaActual + '/' + false])
    }
    else{
      this.spinner.start();
      this.dialogoTurno.verTurno(this.configuracion.fechaActual, consultorioId, turnoId, false, this.viewContainerRef);
    }
  }

  clickEntreturno(consultorioId, turnoId: number){
    if (this.celdaEntreTurnoValor(consultorioId, turnoId) == "Vacío"){
      if (this.fechaTurnos < AgendaComponent.fechaHoy())
      {
        this.notificationSerivce.error("Error", "Está intentando reservar un entreturno para una fecha anterior a la actual!");
        return;
      }
      this.router.navigate(['/nuevo-turno/' + consultorioId + '/' + turnoId + '/' + this.configuracion.fechaActual + '/' + true])
    }
    else{
      this.spinner.start();
      this.dialogoTurno.verTurno(this.configuracion.fechaActual, consultorioId, turnoId, true, this.viewContainerRef);
    }
  }

  celdaEntreTurnoValor(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.id_turno == turnoId && turno.id_consultorio == consultorioId && turno.entreturno == true){
        for (let medico of this.medicos){
          if (medico.id == turno.id_medico){
            return medico.apellido;
          }
        }
      }
    }
    return "Vacío";
  }

  celdaTurnoValor(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.id_turno == turnoId && turno.id_consultorio == consultorioId && turno.entreturno == false){
        for (let medico of this.medicos){
          if (medico.id == turno.id_medico){
            return medico.apellido;
          }
        }
      }
    }
    return "Vacío";
  }

  celdaTurnoColor(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.id_turno == turnoId && turno.id_consultorio == consultorioId && turno.entreturno == false){
        for (let medico of this.medicos){
          if (medico.id == turno.id_medico){
            return medico.color;
          }
        }
      }
    }
    return "";
  }

  traerTurnos(fecha: string){
    this.suscripcionTurnos = this.turnosService.traerTurnos(fecha, this.pararActualizarTurnos).subscribe(turnosDb => {
      this.turnos = turnosDb;
      this.spinner.stop();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  cambiarFecha(fecha:string){
    this.router.navigate(['/redir-agenda/' + fecha]);
  }

}
