import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Medico} from "../../_modelos/medico";
import {NotificationsService} from "angular2-notifications";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialogo-medicos',
  templateUrl: './dialogo-medicos.component.html',
  styleUrls: ['./dialogo-medicos.component.css']
})
export class DialogoMedicosComponent implements OnInit {

  constructor(
    private medicosService: MedicosService,
    private notificationSerivce: NotificationsService,
    private ref: ChangeDetectorRef,
    public dialogRef: MdDialogRef<DialogoMedicosComponent>
  ) { }

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
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
    });
  }

}
