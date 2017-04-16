import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubsistemaMedicosService} from "../../_servicios/datos/subsistema-medicos.service";
import {TurnoResumenMedico} from "../../_modelos/turno-resumen-medico";
import {SpinnerService} from "../../_servicios/spinner.service";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications/dist";

@Component({
  selector: 'app-medico-home',
  templateUrl: './medico-home.component.html',
  styleUrls: ['./medico-home.component.css']
})
export class MedicoHomeComponent implements OnInit, OnDestroy {

  pararActualizarTurnos;

  constructor(
    private subsistemaMedicosService: SubsistemaMedicosService,
    private spinner: SpinnerService,
    private router: Router,
    private notificationsService: NotificationsService
  ) { this.pararActualizarTurnos = new Subject(); }

  turnos: TurnoResumenMedico[] = [];
  suscripcionTurnos;

  ngOnInit() {
  }

  ngOnDestroy() {
    this.pararActualizarTurnos = true;
    this.suscripcionTurnos.unsubscribe();
    this.spinner.start();
  }

  cargarTurnos(){
    this.suscripcionTurnos = this.subsistemaMedicosService.verTurnos(MedicoHomeComponent.fechaHoy(), this.pararActualizarTurnos)
      .subscribe(turnosDb => {
        this.turnos = turnosDb;
        this.spinner.stop();
      }, error => {
        if (error.status == 401){
          this.notificationsService.error("Error","Sesión expirada!");
          this.router.navigate(['/login']);
        }
        let body = JSON.parse(error._body);
        this.notificationsService.error('Error', body.mensaje);
        this.spinner.stop();
      });
  }

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

}
