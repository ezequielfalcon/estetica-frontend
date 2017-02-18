import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Router, ActivatedRoute} from "@angular/router";
import {SpinnerService} from "../../../_servicios/spinner.service";
import {ConsultoriosService} from "../../../_servicios/datos/consultorios.service";

@Component({
  selector: 'app-nuevo-consultorio',
  templateUrl: './nuevo-consultorio.component.html',
  styleUrls: ['./nuevo-consultorio.component.css']
})
export class NuevoConsultorioComponent implements OnInit, OnDestroy {

  constructor(
    private consultoriosService: ConsultoriosService,
    private notificaciones: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) { }

  nuevoConsul: any = {};
  returnUrl: string;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/configuracion/consultorios';
    this.spinner.stop();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  crear(){
    this.consultoriosService.post(this.nuevoConsul.id ,this.nuevoConsul.nombre).subscribe(res => {
      this.notificaciones.success('OK', 'Consultorio creado!');
      this.router.navigate([this.returnUrl]);
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificaciones.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    } );
  }

  cancelar(){
    this.router.navigate([this.returnUrl])
  }

}
