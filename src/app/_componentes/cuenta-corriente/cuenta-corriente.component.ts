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
