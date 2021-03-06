import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Router, ActivatedRoute} from "@angular/router";
import {TratamientosService} from "../../../../_servicios/datos/tratamientos.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";

@Component({
  selector: 'app-nuevo-tratamiento',
  templateUrl: 'nuevo-tratamiento.component.html',
  styleUrls: ['nuevo-tratamiento.component.css']
})
export class NuevoTratamientoComponent implements OnInit, OnDestroy {

  constructor(
    private notif: NotificationsService,
    private tratamientosService: TratamientosService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) { }

  returnUrl: string;
  nuevoTratamiento: any = {};

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/configuracion/tratamientos';
    this.spinner.stop();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cancelar(){
    this.router.navigate([this.returnUrl]);
  }

  crear(){
    this.spinner.start();
    this.tratamientosService.post(this.nuevoTratamiento.nombre, this.nuevoTratamiento.costo).subscribe(() => {
      this.notif.success('OK', 'Tratamiento creado!');
      this.router.navigate([this.returnUrl]);
    }, error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
