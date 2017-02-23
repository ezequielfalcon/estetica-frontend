import { Component, OnInit } from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";
import {Turno} from "../../_modelos/turno";
import {Paciente} from "../../_modelos/paciente";
import {Medico} from "../../_modelos/medico";
import {Tratamiento} from "../../_modelos/tratamiento";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";

@Component({
  selector: 'app-dialogo-turno',
  templateUrl: './dialogo-turno.component.html',
  styleUrls: ['./dialogo-turno.component.css']
})
export class DialogoTurnoComponent implements OnInit {

  constructor(
    private notificationSerivce: NotificationsService,
    public dialogRef: MdDialogRef<DialogoTurnoComponent>,
    private pacientesService: PacientesService,
    private spinner: SpinnerService,
    private medicosService: MedicosService
  ) { }

  turno: Turno;
  paciente: Paciente;
  medico: Medico;
  tratamientos: Tratamiento[] = [];

  ngOnInit() {
  }

  traerPaciente(pacienteId: number){
    this.pacientesService.getById(pacienteId).subscribe(pacienteDb => {
      this.paciente = pacienteDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
    });
  }

  traerMedico(medicoId: number){
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medico = medicoDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
    });
  }

}
