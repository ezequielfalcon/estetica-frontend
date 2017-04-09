import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {TurnosService} from "../../_servicios/datos/turnos.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {SpinnerService} from "../../_servicios/spinner.service";
import {NotificationsService} from "angular2-notifications";
import {Medico} from "../../_modelos/medico";
import {TurnoResumenMedico} from "../../_modelos/turno-resumen-medico";
import {AdicionalTurno} from "../../_modelos/adicional-turno";

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.css']
})
export class LiquidacionesComponent implements OnInit, OnDestroy {

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private medicosService: MedicosService,
    private router: Router,
    private turnosService: TurnosService
  ) {
  }

  medicos: Medico[] = [];
  medicoSeleccionado: number;
  fechaTurnos: string;
  turnosMedico: TurnoResumenMedico[] = [];
  adicionales: AdicionalTurno[] = [];
  adicional: any = {};

  ngOnInit() {
    this.fechaTurnos = LiquidacionesComponent.fechaHoy();
    this.cargarMedicos();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

  medicoSeleccionadoList(medicoId: number){
    this.spinner.start();
    this.cargarTurnos(medicoId, this.fechaTurnos);
  }

  cargarTurnos(medicoId, fecha){
    this.turnosService.traerTurnosPorMedico(medicoId, fecha).subscribe(turnosDb => {
      this.turnosMedico = turnosDb;
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

  agregarAdicional(){
    let nuevoAdicional = new AdicionalTurno;
    nuevoAdicional.adicional = this.adicional.adicional;
    nuevoAdicional.paciente = this.adicional.paciente;
    nuevoAdicional.hora = this.adicional.hora;
    this.adicionales.push(nuevoAdicional);
  }

  subtotalTurnos(){
    let monto = 0;
    for (let turno of this.turnosMedico){
      monto = monto + +turno.costo;
    }
    return monto;
  }

  subtotalAdicionales(){
    let monto = 0;
    for (let adicional of this.adicionales){
      monto = monto + +adicional.adicional;
    }
    return monto;
  }

  turnoStringHora(turnoId: number) {
    let turnoString: string;
    switch (turnoId) {
      case 1:
        turnoString = "09:00";
        break;
      case 1:
        turnoString = "09:20";
        break;
      case 3:
        turnoString = "09:40";
        break;
      case 4:
        turnoString = "10:00";
        break;
      case 5:
        turnoString = "10:20";
        break;
      case 6:
        turnoString = "10:40";
        break;
      case 7:
        turnoString = "11:00";
        break;
      case 8:
        turnoString = "11:20";
        break;
      case 9:
        turnoString = "11:40";
        break;
      case 10:
        turnoString = "12:00";
        break;
      case 11:
        turnoString = "12:20";
        break;
      case 12:
        turnoString = "12:40";
        break;
      case 13:
        turnoString = "13:00";
        break;
      case 14:
        turnoString = "13:20";
        break;
      case 15:
        turnoString = "13:40";
        break;
      case 16:
        turnoString = "14:00";
        break;
      case 17:
        turnoString = "14:20";
        break;
      case 18:
        turnoString = "14:40";
        break;
      case 19:
        turnoString = "15:00";
        break;
      case 20:
        turnoString = "15:20";
        break;
      case 21:
        turnoString = "15:40";
        break;
      case 22:
        turnoString = "16:00";
        break;
      case 23:
        turnoString = "16:20";
        break;
      case 24:
        turnoString = "16:40";
        break;
      case 25:
        turnoString = "17:00";
        break;
      case 26:
        turnoString = "17:20";
        break;
      case 27:
        turnoString = "17:40";
        break;
      case 28:
        turnoString = "18:00";
        break;
      case 29:
        turnoString = "18:20";
        break;
      case 30:
        turnoString = "18:40";
        break;
      case 31:
        turnoString = "19:00";
        break;
      case 32:
        turnoString = "19:20";
        break;
      case 33:
        turnoString = "19:40";
        break;
      case 34:
        turnoString = "20:00";
        break;
      case 35:
        turnoString = "20:20";
        break;
      case 36:
        turnoString = "20:40";
        break;
      case 37:
        turnoString = "21:00";
        break;
      default:
        turnoString = "error";
        break;
    }
    return turnoString;
  }
}
