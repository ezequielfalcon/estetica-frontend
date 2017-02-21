import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Router} from "@angular/router";
import {SpinnerService} from "../../_servicios/spinner.service";
import {TratamientosService} from "../../_servicios/datos/tratamientos.service";
import {Tratamiento} from "../../_modelos/tratamiento";

@Component({
  selector: 'app-tratamientos',
  templateUrl: './tratamientos.component.html',
  styleUrls: ['./tratamientos.component.css']
})
export class TratamientosComponent implements OnInit, OnDestroy {

  constructor(private notificationService: NotificationsService,
              private router: Router,
              private spinner: SpinnerService,
              private tratamientosService: TratamientosService) {
  }

  tratamientos: Tratamiento[] = [];

  ngOnInit() {
    this.cargarTratamientos();
  }

  cargarTratamientos() {
    this.tratamientosService.getAll().subscribe(tratamientosDb => {
      this.tratamientos = tratamientosDb;
      this.spinner.stop()
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationService.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  detalles(id: number){
    this.router.navigate(['/tratamientos/' + id]);
  }
}
