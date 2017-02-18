import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Router, ActivatedRoute} from "@angular/router";
import {SpinnerService} from "../../../_servicios/spinner.service";
import {MedicosService} from "../../../_servicios/datos/medicos.service";

@Component({
  selector: 'app-nuevo-medico',
  templateUrl: './nuevo-medico.component.html',
  styleUrls: ['./nuevo-medico.component.css']
})
export class NuevoMedicoComponent implements OnInit, OnDestroy {

  constructor(
    private medicosService: MedicosService,
    private notif: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) { }

  returnUrl: string;
  nuevoMedico: any = {};

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/configuracion/medicos';
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
    this.medicosService.post(this.nuevoMedico.nombre, this.nuevoMedico.apellido,
      this.nuevoMedico.mail, this.nuevoMedico.color).subscribe(nuevoM => {
      this.notif.success('OK', 'Médico creado con ID ' + nuevoM.id);
      this.router.navigate([this.returnUrl]);
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notif.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

}
