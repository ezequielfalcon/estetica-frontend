import {Component, OnInit, state} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";
import {Tratamiento} from "../../_modelos/tratamiento";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {TurnosService} from "../../_servicios/datos/turnos.service";
import {TratamientosService} from "../../_servicios/datos/tratamientos.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialogo-turno',
  templateUrl: './dialogo-turno.component.html',
  styleUrls: ['./dialogo-turno.component.css']
})
export class DialogoTurnoComponent implements OnInit {

  constructor(
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoTurnoComponent>,
    private pacientesService: PacientesService,
    private spinner: SpinnerService,
    private medicosService: MedicosService,
    private turnosService: TurnosService,
    private tratamientosService: TratamientosService,
    private router: Router
  ) { }

  public consultorioId: number;
  public turnoId: number;
  public fecha: string;
  public entreturno: boolean;

  turno: any = {};
  paciente: any = {};
  medico: any = {};
  tratamientos: Tratamiento[] = [];
  edicion: boolean = false;

  ngOnInit() {
    this.cargarTurno();
  }

  cargarTurno(){
    this.turnosService.traerTurno(this.consultorioId, this.turnoId, this.fecha, this.entreturno).subscribe(
      turnoDb => {
        this.turno = turnoDb;
        this.turno.fecha = turnoDb.fecha.substr(0,10);
        this.traerPaciente(this.turno.id_paciente);
        this.traerMedico(this.turno.id_medico);
        this.cargarTratamientosAgenda(this.turno.id);
      }, error => {
        if (error.status == 401){
          this.notificationService.error("Error","Sesión expirada!");
          this.router.navigate(['/login']);
        }
        let body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
    );
  }

  traerPaciente(pacienteId: number){
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.paciente = pacienteDb;
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  traerMedico(medicoId: number){
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medico = medicoDb;
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  cargarTratamientosAgenda(agendaId: number) {
    this.tratamientosService.traerAgenda(agendaId).subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
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

  detallesMedico(id: number){
    this.dialogRef.close();
    this.router.navigate(['/medicos/' + id], { queryParams: { returnUrl: '/agenda' }});
  }

  detallesPaciente(id: number){
    this.dialogRef.close();
    this.router.navigate(['/pacientes/' + id], { queryParams: { returnUrl: '/agenda' }});
  }

  editarTurno(){
    this.edicion = true;
  }

  pacientePresente(){
    this.spinner.start();
    if (this.turno.fecha < DialogoTurnoComponent.fechaHoy() || this.turno.fecha > DialogoTurnoComponent.fechaHoy()){
      this.notificationService.alert('Advertencia', 'No puede confirmar presencia de un turno distinto al día de hoy!');
      this.spinner.stop();
    }
    else {
      this.turnosService.confirmarPresencia(this.turno.id, !this.turno.presente).subscribe(() => {
        this.edicion = false;
        this.spinner.stop();
        this.dialogRef.close();
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
  }

  borrarTurno(){
    this.spinner.start();
    this.turnosService.borrar(this.turno.id).subscribe(() => {
      this.notificationService.success("OK", "Turno borrado correctamente");
      this.dialogRef.close();
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

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

}
