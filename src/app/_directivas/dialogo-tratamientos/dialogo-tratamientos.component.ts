import { Component, OnInit } from '@angular/core';
import {Tratamiento} from "../../_modelos/tratamiento";
import {NotificationsService} from "angular2-notifications";
import {TratamientosService} from "../../_servicios/datos/tratamientos.service";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";

@Component({
  selector: 'app-dialogo-tratamientos',
  templateUrl: './dialogo-tratamientos.component.html',
  styleUrls: ['./dialogo-tratamientos.component.css']
})
export class DialogoTratamientosComponent implements OnInit {

  constructor(
    private notificationService: NotificationsService,
    private tratamientosService: TratamientosService,
    public dialogRef: MdDialogRef<DialogoTratamientosComponent>,
    private spinner: SpinnerService
  ) {
    this.spinner.start();
  }

  tratamientos: Tratamiento[] = [];

  ngOnInit() {
    this.cargarTratamientos();
  }

  cargarTratamientos() {
    this.tratamientosService.getAll().subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
      this.spinner.stop();
    }, error => {
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
