import { Component, OnInit } from '@angular/core';
import {Tratamiento} from "../../_modelos/tratamiento";
import {NotificationsService} from "angular2-notifications";
import {TratamientosService} from "../../_servicios/datos/tratamientos.service";
import {MdDialogRef} from "@angular/material";
import {SpinnerService} from "../../_servicios/spinner.service";
import {Router} from "@angular/router";

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
    private spinner: SpinnerService,
    private router: Router
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
