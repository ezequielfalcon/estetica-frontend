import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {Medico} from '../../_modelos/medico';
import {TurnoResumenMedico} from '../../_modelos/turno-resumen-medico';
import {AdicionalTurno} from '../../_modelos/adicional-turno';
import {DialogoMedicosService} from '../../_servicios/dialogos/dialogo-medicos.service';
import {DialogoModificarCostoTurnoService} from '../../_servicios/dialogos/dialogo-modificar-costo-turno.service';
import {TratamientosService} from '../../_servicios/datos/tratamientos.service';
import {Horario} from '../../_modelos/horario';
import {Liquidacion} from '../../_modelos/reportes/liquidacion';
import {TurnoReporte} from '../../_modelos/reportes/turno-reporte';
import {JsreportService} from '../../_servicios/jsreport.service';

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.css']
})
export class LiquidacionesComponent implements OnInit, OnDestroy {

  medicoSeleccionado: Medico;
  medicoSeleccionadoBool = false;
  fechaTurnos: string;
  turnosMedico: TurnoResumenMedico[] = [];
  adicionales: AdicionalTurno[] = [];
  horarios: Horario[] = [];
  adicional: any = {};
  descuentos = 0;

  private static fechaHoy() {
    const fechaObject = new Date();
    const mesString = (fechaObject.getMonth() + 1) < 10 ? '0'
      + (fechaObject.getMonth() + 1).toString() : (fechaObject.getMonth() + 1).toString();
    const diaString = fechaObject.getDate() < 10 ? '0' + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + '-' + mesString + '-' + diaString;
  }

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private medicosService: MedicosService,
    private router: Router,
    private dialogoMedicos: DialogoMedicosService,
    private turnosService: TurnosService,
    private viewContainerRef: ViewContainerRef,
    private costoDialog: DialogoModificarCostoTurnoService,
    private tratamientosService: TratamientosService,
    private jsreport: JsreportService
  ) {
  }

  ngOnInit() {
    this.fechaTurnos = LiquidacionesComponent.fechaHoy();
    this.cargarHorarios();
    this.spinner.stop();
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  borrarAdicional(addId: number) {
    for (const adicional of this.adicionales){
      if (adicional.id === addId) {
        const indiceAdd = this.adicionales.indexOf(adicional);
        this.adicionales.splice(indiceAdd, 1);
      }
    }
  }

  cambiarCosto(agendaId: number, costoOriginal: number) {
    this.costoDialog.modificarCosto(this.viewContainerRef, agendaId, costoOriginal).subscribe(() => {
      this.cargarTurnos(this.medicoSeleccionado.id, this.fechaTurnos);
    });
  }

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  seleccionarMedico() {
    this.spinner.start();
    this.dialogoMedicos.seleccionarMedico(this.viewContainerRef)
      .subscribe(medicoSeleccionado => {
        if (medicoSeleccionado) {
          this.spinner.start();
          this.cargarMedico(medicoSeleccionado);
          this.cargarTurnos(medicoSeleccionado, this.fechaTurnos);
        }
      }, error => {
        if (error.status === 401) {
          this.notificationService.error('Error', 'Sesión expirada!');
          this.router.navigate(['/login']);
        }
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
        this.spinner.stop();
      });
  }

  otroMedico() {
    this.medicoSeleccionadoBool = false;
    this.seleccionarMedico();
  }

  cambiarFecha() {
    this.spinner.start();
    this.cargarTurnos(this.medicoSeleccionado.id, this.fechaTurnos);
  }

  cargarMedico(medicoId) {
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medicoSeleccionado = medicoDb;
      this.medicoSeleccionadoBool = true;
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarTurnos(medicoId, fecha) {
    this.turnosService.traerTurnosPorMedico(medicoId, fecha).subscribe(turnosDb => {
      this.turnosMedico = turnosDb;
      for (const turnoMedico of this.turnosMedico) {
        this.cargarTratamientosPorTurno(turnoMedico);
      }
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarTratamientosPorTurno(turnoMedico: TurnoResumenMedico) {
    this.tratamientosService.traerAgenda(turnoMedico.id).subscribe(tratamientosDb => {
      if (tratamientosDb.length === 1 && tratamientosDb[0].nombre === 'Consulta') {
        turnoMedico.tratamientos = ' ';
      } else {
        turnoMedico.tratamientos = '';
        for (const tratamientoDb of tratamientosDb) {
          turnoMedico.tratamientos = turnoMedico.tratamientos + tratamientoDb.nombre + ' ';
        }
      }
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  agregarAdicional() {
    if (this.adicional.adicional && this.adicional.paciente && this.adicional.hora) {
      if (this.adicional.adicional < 0.1) {
        this.notificationService.alert('Alerta', 'Ingrese un monto mayor a 0.');
        return;
      }
      const nuevoAdicional = new AdicionalTurno;
      nuevoAdicional.adicional = this.adicional.adicional;
      nuevoAdicional.paciente = this.adicional.paciente;
      nuevoAdicional.hora = this.adicional.hora;
      nuevoAdicional.id = Math.floor(Math.random() * 1000) + 1;
      this.adicionales.push(nuevoAdicional);
      this.adicional.adicional = '';
      this.adicional.paciente = '';
      this.adicional.hora = '';
    } else {
      this.notificationService.alert('Advertencia', 'Complete todos los campos para agregar un adicional.');
    }
  }

  subtotalTurnos() {
    let monto = 0;
    for (const turno of this.turnosMedico){
      monto = monto + +turno.costo + +turno.costo2 + +turno.costo3;
    }
    return monto;
  }

  subtotalAdicionales() {
    let monto = 0;
    for (const adicional of this.adicionales){
      monto = monto + +adicional.adicional;
    }
    return monto;
  }

  imprimir() {
    this.spinner.start();
    const liquidacion = new Liquidacion();
    liquidacion.turnos = [];
    liquidacion.medico = this.medicoSeleccionado.nombre + ' ' + this.medicoSeleccionado.apellido;
    liquidacion.fecha = this.fechaTurnos;
    liquidacion.subtotal = this.subtotalTurnos() + this.subtotalAdicionales();
    liquidacion.descuentos = this.descuentos;
    liquidacion.total = this.subtotalTurnos() +  this.subtotalAdicionales() - this.descuentos;
    for (const turno of this.turnosMedico) {
      const nuevoTurno = new TurnoReporte();
      nuevoTurno.horario = this.convertirHora(turno.id_turno);
      nuevoTurno.paciente = turno.paciente;
      nuevoTurno.costo = turno.costo;
      nuevoTurno.costo2 = turno.costo2;
      nuevoTurno.costo3 = turno.costo3;
      liquidacion.turnos.push(nuevoTurno);
    }
    for (const adicional of this.adicionales) {
      const nuevoAdicional = new TurnoReporte();
      nuevoAdicional.horario = adicional.hora;
      nuevoAdicional.paciente = 'ADICIONAL: ' + adicional.paciente;
      nuevoAdicional.costo = +adicional.adicional;
      nuevoAdicional.costo2 = 0;
      nuevoAdicional.costo3 = 0;
      liquidacion.turnos.push(nuevoAdicional);
    }
    this.jsreport.generarLiquidacion(liquidacion);
  }
}
