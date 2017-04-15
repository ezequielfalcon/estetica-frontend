import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Router, ActivatedRoute} from "@angular/router";
import {MedicosService} from "../../../../_servicios/datos/medicos.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";

@Component({
  selector: 'app-nuevo-medico',
  templateUrl: 'nuevo-medico.component.html',
  styleUrls: ['nuevo-medico.component.css']
})
export class NuevoMedicoComponent implements OnInit, OnDestroy {


  constructor(
    private medicosService: MedicosService,
    private notif: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) {
  }

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
    if (this.nuevoMedico.clave != this.nuevoMedico.clave2){
      this.spinner.stop();
      this.notif.error("Error", "Las contraseñas no coinciden");
      return;
    }
    this.medicosService.post(this.nuevoMedico.nombre, this.nuevoMedico.apellido,
      this.nuevoMedico.mail, this.nuevoMedico.usuario, this.nuevoMedico.clave).subscribe(nuevoM => {
      this.notif.success('OK', 'Médico creado con ID ' + nuevoM.id);
      this.router.navigate([this.returnUrl]);
    }, error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
