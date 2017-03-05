import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Paciente} from "../../_modelos/paciente";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {NotificationsService} from "angular2-notifications";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialogo-pacientes',
  templateUrl: './dialogo-pacientes.component.html',
  styleUrls: ['./dialogo-pacientes.component.css']
})
export class DialogoPacientesComponent implements OnInit {

  constructor(
    private ref: ChangeDetectorRef,
    private pacientesService: PacientesService,
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoPacientesComponent>,
    private spinner: SpinnerService,
    private router: Router
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
