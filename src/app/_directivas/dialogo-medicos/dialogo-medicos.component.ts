import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Medico} from "../../_modelos/medico";
import {NotificationsService} from "angular2-notifications";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";

@Component({
  selector: 'app-dialogo-medicos',
  templateUrl: './dialogo-medicos.component.html',
  styleUrls: ['./dialogo-medicos.component.css']
})
export class DialogoMedicosComponent implements OnInit {

  constructor(
    private medicosService: MedicosService,
    private notificationService: NotificationsService,
    private ref: ChangeDetectorRef,
    public dialogRef: MdDialogRef<DialogoMedicosComponent>,
    private spinner: SpinnerService
  ) {
    this.spinner.start();
  }

  medicos: Medico[] = [];
  search: string = "";
  searchApe: string = "";

  ngOnInit() {
    this.cargarMedicos();
    this.ref.markForCheck();
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
      this.spinner.stop();
    }, error => {
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
