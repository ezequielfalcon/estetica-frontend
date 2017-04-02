import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {TurnosService} from "../../_servicios/datos/turnos.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {SpinnerService} from "../../_servicios/spinner.service";
import {NotificationsService} from "angular2-notifications";
import {Medico} from "../../_modelos/medico";
import {TurnoResumen} from "../../_modelos/turno-resumen";

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
    private router: Router
  ) { }

  medicos: Medico[] = [];
  medicoSeleccionado: number;
  fechaTurnos: string;
  turnosMedico: TurnoResumen[] = [];

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
    console.log(medicoId);
    this.spinner.stop();
  }

}
