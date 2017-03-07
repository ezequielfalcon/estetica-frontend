import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {TurnosService} from "../../../_servicios/datos/turnos.service";
import {NotificationsService} from "angular2-notifications";
import {SpinnerService} from "../../../_servicios/spinner.service";
import {MedicosService} from "../../../_servicios/datos/medicos.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Medico} from "../../../_modelos/medico";
import {PacientesService} from "../../../_servicios/datos/pacientes.service";
import {Paciente} from "../../../_modelos/paciente";
import {DialogoPacientesService} from "../../../_servicios/dialogos/dialogo-pacientes.service";
import {DialogoMedicosService} from "../../../_servicios/dialogos/dialogo-medicos.service";
import {Tratamiento} from "../../../_modelos/tratamiento";
import {TratamientosService} from "../../../_servicios/datos/tratamientos.service";
import {DialogoTratamientosService} from "../../../_servicios/dialogos/dialogo-tratamientos.service";

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private medicosService: MedicosService,
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService,
    private pacientesService: PacientesService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private dialogoPacientes: DialogoPacientesService,
    private dialogoMedicos: DialogoMedicosService,
    private tratamientosService: TratamientosService,
    private dialogoTratamientos: DialogoTratamientosService
  ) { }

  medicos: Medico[] = [];
  pacientes: Paciente[] = [];
  tratamientos: Tratamiento[] = [];
  pacienteSeleccionado: Paciente;
  medicoSelecionado: Medico;
  tratamientosSeleccionados: Tratamiento[] = [];
  nuevoTurno: any = {};
  returnUrl: string;
  entreturno: boolean;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.nuevoTurno.consultorioId = params["consultorio"];
      this.nuevoTurno.turnoId = params["turno"];
      this.nuevoTurno.turnoString = NuevoTurnoComponent.turnoStringHora(this.nuevoTurno.turnoId);
      this.nuevoTurno.fechaTurno = params["fecha"];
      this.nuevoTurno.costoTurno = 0;
      this.entreturno = params["entreturno"];
    });
    this.cargarMedicos();
    this.cargarPacientes();
    this.cargarTratamientos();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/agenda';
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
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

  private cargarPacientes(){
    this.pacientesService.getAll().subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
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

  cargarTratamientos() {
    this.tratamientosService.getAll().subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
    }, error => {
      if (error.status == 401){
        this.notificationSerivce.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
    });
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cancelar(){
    this.router.navigate([this.returnUrl]);
  }

  seleccionarPaciente(){
    this.spinner.start();
    this.dialogoPacientes.seleccionarPaciente(this.viewContainerRef)
      .subscribe(pacienteSeleccionado => {
        for (let paciente of this.pacientes){
          if (paciente.id == pacienteSeleccionado){
            this.pacienteSeleccionado = paciente;
          }
        }
      });
  }

  seleccionarMedico(){
    this.spinner.start();
    this.dialogoMedicos.seleccionarMedico(this.viewContainerRef)
      .subscribe(medicoSeleccionado => {
        for (let medico of this.medicos){
          if (medico.id == medicoSeleccionado){
            this.medicoSelecionado = medico;
          }
        }
      });
  }

  agregarTratamiento(){
    this.spinner.start();
    this.dialogoTratamientos.seleccionarTratamiento(this.viewContainerRef)
      .subscribe(tratamientoSeleccionadoDb => {
        for (let tratamiento of this.tratamientos){
          if (tratamiento.id == tratamientoSeleccionadoDb){
            for (let tratamientosAgregados of this.tratamientosSeleccionados){
              if (tratamientosAgregados.id == tratamientoSeleccionadoDb) {
                this.notificationSerivce.alert("Advertencia", "Ya agregó ese tratamiento a al turno!");
                return;
              }
            }
            this.tratamientosSeleccionados.push(tratamiento);
            this.nuevoTurno.costoTurno = this.nuevoTurno.costoTurno + +tratamiento.costo;
          }
        }
      });
  }

  crear(){
    this.spinner.start();
    if (!this.nuevoTurno.observaciones){
      this.nuevoTurno.observaciones = " ";
    }
    this.turnosService.nuevoTurno(this.nuevoTurno.turnoId,
      this.pacienteSeleccionado.id, this.nuevoTurno.consultorioId,
      this.medicoSelecionado.id,
      this.nuevoTurno.observaciones, this.nuevoTurno.costoTurno,
      this.nuevoTurno.fechaTurno, this.entreturno).subscribe((agendaId) => {
        for (let tratamientosSeleccionadosList of this.tratamientosSeleccionados){
          this.turnosService.agregarTratamiento(agendaId, tratamientosSeleccionadosList.id).subscribe(() => {
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
      this.notificationSerivce.success("OK", "Nuevo turno creado con ID: " + agendaId);
        this.router.navigate([this.returnUrl]);
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

  static turnoStringHora(turnoId: string){
    let turnoString: string;
    switch (turnoId){
      case "1":
        turnoString = "09:00";
        break;
      case "2":
        turnoString = "09:20";
        break;
      case "3":
        turnoString = "09:40";
        break;
      case "4":
        turnoString = "10:00";
        break;
      case "5":
        turnoString = "10:20";
        break;
      case "6":
        turnoString = "10:40";
        break;
      case "7":
        turnoString = "11:00";
        break;
      case "8":
        turnoString = "11:20";
        break;
      case "9":
        turnoString = "11:40";
        break;
      case "10":
        turnoString = "12:00";
        break;
      case "11":
        turnoString = "12:20";
        break;
      case "12":
        turnoString = "12:40";
        break;
      case "13":
        turnoString = "13:00";
        break;
      case "14":
        turnoString = "13:20";
        break;
      case "15":
        turnoString = "13:40";
        break;
      case "16":
        turnoString = "14:00";
        break;
      case "17":
        turnoString = "14:20";
        break;
      case "18":
        turnoString = "14:40";
        break;
      case "19":
        turnoString = "15:00";
        break;
      case "20":
        turnoString = "15:20";
        break;
      case "21":
        turnoString = "15:40";
        break;
      case "22":
        turnoString = "16:00";
        break;
      case "23":
        turnoString = "16:20";
        break;
      case "24":
        turnoString = "16:40";
        break;
      case "25":
        turnoString = "17:00";
        break;
      case "26":
        turnoString = "17:20";
        break;
      case "27":
        turnoString = "17:40";
        break;
      case "28":
        turnoString = "18:00";
        break;
      case "29":
        turnoString = "18:20";
        break;
      case "30":
        turnoString = "18:40";
        break;
      case "31":
        turnoString = "19:00";
        break;
      case "32":
        turnoString = "19:20";
        break;
      case "33":
        turnoString = "19:40";
        break;
      case "34":
        turnoString = "20:00";
        break;
      case "35":
        turnoString = "20:20";
        break;
      case "36":
        turnoString = "20:40";
        break;
      case "37":
        turnoString = "21:00";
        break;
      default:
        turnoString = "error";
        break;
    }
    return turnoString;
  }

}
