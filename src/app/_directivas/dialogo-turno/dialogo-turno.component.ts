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

  ngOnInit() {
    this.turnosService.traerTurno(this.consultorioId, this.turnoId, this.fecha, this.entreturno).subscribe(
      turnoDb => {
        this.turno = turnoDb;
        this.traerPaciente(this.turno.id_paciente);
        this.traerMedico(this.turno.id_medico);
        this.cargarTratamientosAgenda(this.turno.id);
      }, error => {
        let body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      }
    );
  }

  traerPaciente(pacienteId: number){
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.paciente = pacienteDb;
    }, error => {
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  traerMedico(medicoId: number){
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medico = medicoDb;
    }, error => {
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  cargarTratamientosAgenda(agendaId: number) {
    this.tratamientosService.traerAgenda(agendaId).subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
      this.spinner.stop();
    }, error => {
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

}