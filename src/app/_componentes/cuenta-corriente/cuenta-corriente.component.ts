import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {CuentaCorrienteService} from "../../_servicios/datos/cuenta-corriente.service";
import {CuentaCorriente} from "../../_modelos/cuenta-corriente";
import {Paciente} from "../../_modelos/paciente";
import {DialogoPacientesService} from "../../_servicios/dialogos/dialogo-pacientes.service";
import {SpinnerService} from "../../_servicios/spinner.service";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {NotificationsService} from "angular2-notifications";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  styleUrls: ['./cuenta-corriente.component.css']
})
export class CuentaCorrienteComponent implements OnInit, OnDestroy {

  constructor(
    private dialogoPacientes: DialogoPacientesService,
    private viewContainerRef: ViewContainerRef,
    private spinner: SpinnerService,
    private pacientesService: PacientesService,
    private notificationSerivce: NotificationsService,
    private router: Router,
    private cteCtaService: CuentaCorrienteService
  ) { }

  cuentaCorriente: CuentaCorriente[] = [];
  paciente: Paciente;
  pacienteSeleccionado: boolean = false;

  ngOnInit() {
    this.spinner.stop();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  otroPaciente(){
    this.pacienteSeleccionado = false;
    this.seleccionarPaciente();
  }

  saldo(){
    let montos:number = 0;
    for(let cuenta of this.cuentaCorriente){
      montos = montos + +cuenta.monto;
    }
    return montos;
  }

  saldoColor(){
    let color = "accent";
    if (this.saldo() > 0) color = "warn";
    return color;
  }

  seleccionarPaciente(){
    this.spinner.start();
    this.dialogoPacientes.seleccionarPaciente(this.viewContainerRef)
      .subscribe(pacienteSeleccionado => {
        if (pacienteSeleccionado){
          this.spinner.start();
          this.pacientesService.getById(pacienteSeleccionado).subscribe(pacienteDb => {
            this.paciente = pacienteDb;
            this.pacienteSeleccionado = true;
            this.cteCtaService.traerCuenta(this.paciente.id).subscribe(cuentasDb => {
              this.cuentaCorriente = cuentasDb;
              this.spinner.stop();
            }, error => {
              if (error.status == 401){
                this.notificationSerivce.error("Error","Sesión expirada!");
                this.router.navigate(['/login']);
              }
              let body = JSON.parse(error._body);
              this.notificationSerivce.error('Error', body.mensaje);
              this.spinner.stop();
              return;
            });
          }, error => {
            if (error.status == 401){
              this.notificationSerivce.error("Error","Sesión expirada!");
              this.router.navigate(['/login']);
            }
            let body = JSON.parse(error._body);
            this.notificationSerivce.error('Error', body.mensaje);
            this.spinner.stop();
            return;
          });
        }
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

}
