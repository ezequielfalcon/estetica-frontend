import { Component, OnInit } from '@angular/core';
import {TratamientoBusqueda} from '../../../_modelos/tratamiento-busqueda';
import {Router} from '@angular/router';
import {SpinnerService} from '../../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {TratamientosService} from '../../../_servicios/datos/tratamientos.service';

@Component({
  selector: 'app-tratamientos-comunes',
  templateUrl: './tratamientos-comunes.component.html',
  styleUrls: ['./tratamientos-comunes.component.css']
})
export class TratamientosComunesComponent implements OnInit {

  tratamientos: TratamientoBusqueda[] = [];
  fechaOld: string;
  fechaNew: string;

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private router: Router,
    private tratamientosService: TratamientosService
  ) { }

  ngOnInit() {
  }

  cargarTratamientosCheck() {
    if (this.fechaOld && this.fechaNew) {
      if (this.fechaOld <= this.fechaNew) {
        this.spinner.start();
        this.cargarTratamientos(this.fechaOld, this.fechaNew);
      } else {
        this.notificationService.warn('Error', 'Las fechas seleccionadas son inválidas!');
      }
    }
  }

  cargarTratamientos(fechaOld: string, fechaNew: string) {
    this.tratamientosService.buscar(fechaOld, fechaNew).subscribe(tratDb => {
      this.tratamientos = tratDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
