import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {Router, ActivatedRoute} from "@angular/router";
import {IColorPickerConfiguration} from "ng2-color-picker";
import {MedicosService} from "../../../../_servicios/datos/medicos.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";

@Component({
  selector: 'app-nuevo-medico',
  templateUrl: 'nuevo-medico.component.html',
  styleUrls: ['nuevo-medico.component.css']
})
export class NuevoMedicoComponent implements OnInit, OnDestroy {

  public configColores: IColorPickerConfiguration;

  constructor(
    private medicosService: MedicosService,
    private notif: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) {
    this.configColores = {
      width: 25,
      height: 25,
      borderRadius: 4,
      availableColors: [
        '#33cccc',
        '#0000FF',
        '#99cc99',
        '#239B56',
        '#00796B',
        '#cc99cc',
        '#EBDEF0',
        '#fabf8f',
        '#E59866',
        '#bfbfbf',
        '#5D6D7E',
        '#6699ff',
        '#ff6666',
        '#ffcc66',
        '#F1C40F',
        '#E91E63'
      ]
    };
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
    this.medicosService.post(this.nuevoMedico.nombre, this.nuevoMedico.apellido,
      this.nuevoMedico.mail, this.nuevoMedico.color).subscribe(nuevoM => {
      this.notif.success('OK', 'Médico creado con ID ' + nuevoM.id);
      this.router.navigate([this.returnUrl]);
    }, error => {
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
