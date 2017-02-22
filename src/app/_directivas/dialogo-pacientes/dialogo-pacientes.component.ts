import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Paciente} from "../../_modelos/paciente";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {NotificationsService} from "angular2-notifications";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";

@Component({
  selector: 'app-dialogo-pacientes',
  templateUrl: './dialogo-pacientes.component.html',
  styleUrls: ['./dialogo-pacientes.component.css']
})
export class DialogoPacientesComponent implements OnInit {

  constructor(
    private ref: ChangeDetectorRef,
    private pacientesService: PacientesService,
    private notificationSerivce: NotificationsService,
    public dialogRef: MdDialogRef<DialogoPacientesComponent>,
    private spinner: SpinnerService
  ) {
    this.spinner.start();
  }

  pacientes: Paciente[] = [];
  search: string = "";
  searchDni: string = "";
  searchApe: string = "";

  ngOnInit() {
    this.cargarPacientes();
    this.ref.markForCheck();
  }

  private cargarPacientes(){
    this.pacientesService.getAll().subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

}
