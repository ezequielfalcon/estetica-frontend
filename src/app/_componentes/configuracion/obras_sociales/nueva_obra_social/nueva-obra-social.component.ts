/**
 * Created by falco on 27/1/2017.
 */
import {Component, OnInit, OnDestroy} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {Router, ActivatedRoute} from "@angular/router";
import {ObrasSocialesService} from "../../../../_servicios/datos/obras-sociales.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";

@Component({
  selector: 'nueva-os',
  templateUrl: 'nueva-obra-social.component.html'
})

export class NuevaObraSocialComponent implements OnInit, OnDestroy {

  nuevaOs: any = {};
  returnUrl: string;

  constructor (
    private osService: ObrasSocialesService,
    private notificaciones: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) { }

  ngOnInit(){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/configuracion/obras-sociales';
    this.spinner.stop();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  crear(){
    this.osService.post(this.nuevaOs.nombre).subscribe(res => {
      this.notificaciones.success('OK', 'Obra social creada con ID ' + res.id);
      this.router.navigate([this.returnUrl]);
    }, error => {
      if (error.status == 401){
        this.notificaciones.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificaciones.error('Error', body.mensaje);
      this.spinner.stop();
    } );
  }

  cancelar(){
    this.router.navigate([this.returnUrl])
  }

}
