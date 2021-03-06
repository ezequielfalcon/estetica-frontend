import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {CuentaCorrienteService} from '../../_servicios/datos/cuenta-corriente.service';
import {CuentaCorriente} from '../../_modelos/cuenta-corriente';
import {Paciente} from '../../_modelos/paciente';
import {DialogoPacientesService} from '../../_servicios/dialogos/dialogo-pacientes.service';
import {SpinnerService} from '../../_servicios/spinner.service';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {DialogoCtacteService} from '../../_servicios/dialogos/dialogo-ctacte.service';
import {DialogoNuevoPacienteService} from '../../_servicios/dialogos/dialogo-nuevo-paciente.service';
import {SaldoCuentaCorriente} from '../../_modelos/saldo-cuenta-corriente';

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  styleUrls: ['./cuenta-corriente.component.css']
})
export class CuentaCorrienteComponent implements OnInit, OnDestroy {

  cuentaCorriente: CuentaCorriente[] = [];
  paciente: Paciente;
  pacienteSeleccionado = false;
  saldos: SaldoCuentaCorriente[] = [];

  constructor(
    private dialogoPacientes: DialogoPacientesService,
    private viewContainerRef: ViewContainerRef,
    private spinner: SpinnerService,
    private pacientesService: PacientesService,
    private notificationSerivce: NotificationsService,
    private router: Router,
    private cteCtaService: CuentaCorrienteService,
    private dialogoCtaCteService: DialogoCtacteService,
    private dialogoNuevoPaciente: DialogoNuevoPacienteService
  ) { }

  ngOnInit() {
    this.cargarSaldos();
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  otroPaciente() {
    this.pacienteSeleccionado = false;
    this.cargarSaldos();
    this.seleccionarPaciente();
  }

  cargarSaldos() {
    this.cteCtaService.traerSlados().subscribe(saldosDb => {
      this.saldos = saldosDb;
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

  saldo() {
    let montos = 0;
    for (const cuenta of this.cuentaCorriente){
      montos = montos + +cuenta.monto;
    }
    return montos;
  }

  saldoColor() {
    let color = 'accent';
    if (this.saldo() > 0) {
      color = 'warn';
    }
    return color;
  }

  saldoSinSigno(saldoNum): number {
    let saldoNuevo = saldoNum;
    if (saldoNuevo < 0) {
      saldoNuevo = saldoNuevo * -1;
    }
    return saldoNuevo;
  }

  nuevoMovimiento() {
    this.dialogoCtaCteService.nuevoMovimiento(this.viewContainerRef, this.paciente.id).subscribe(() => {
      this.traerCtaCte(this.paciente.id);
    });
  }

  traerCtaCte(pacienteId: number) {
    this.cteCtaService.traerCuenta(pacienteId).subscribe(cuentasDb => {
      this.cuentaCorriente = cuentasDb;
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

  seleccionarPaciente() {
    this.spinner.start();
    this.dialogoPacientes.seleccionarPaciente(this.viewContainerRef)
      .subscribe(pacienteSeleccionado => {
        if (pacienteSeleccionado) {
          if (pacienteSeleccionado === -1) {
            this.dialogoNuevoPaciente.crearPaciente(this.viewContainerRef).subscribe(nuevoPacienteSeleccionado => {
              if (nuevoPacienteSeleccionado) {
                this.cargarPaciente(nuevoPacienteSeleccionado);
              }
            });
          } else {
            this.spinner.start();
            this.cargarPaciente(pacienteSeleccionado);
          }
        }
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

  cargarPaciente(pacienteId) {
    if (!this.spinner.status) {
      this.spinner.start();
    }
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.paciente = pacienteDb;
      this.pacienteSeleccionado = true;
      this.traerCtaCte(this.paciente.id);
    }, error => {
      if (error.status === 401) {
        this.notificationSerivce.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
      return;
    });
  }

}
