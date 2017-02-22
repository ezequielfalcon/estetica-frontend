import { Component, OnInit } from '@angular/core';
import {Tratamiento} from "../../_modelos/tratamiento";
import {NotificationsService} from "angular2-notifications";
import {TratamientosService} from "../../_servicios/datos/tratamientos.service";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialogo-tratamientos',
  templateUrl: './dialogo-tratamientos.component.html',
  styleUrls: ['./dialogo-tratamientos.component.css']
})
export class DialogoTratamientosComponent implements OnInit {

  constructor(
    private notificationService: NotificationsService,
    private tratamientosService: TratamientosService,
    public dialogRef: MdDialogRef<DialogoTratamientosComponent>
  ) { }

  tratamientos: Tratamiento[] = [];

  ngOnInit() {
    this.cargarTratamientos();
  }

  cargarTratamientos() {
    this.tratamientosService.getAll().subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationService.error('Error', mensajeError.mensaje);
    });
  }

}
