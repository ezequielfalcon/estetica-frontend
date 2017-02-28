/**
 * Created by falco on 27/1/2017.
 */
import {Component, OnInit, ViewContainerRef, OnDestroy} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {NotificationsService} from "angular2-notifications";
import {ObraSocial} from "../../../../_modelos/obra_social";
import {ObrasSocialesService} from "../../../../_servicios/datos/obras-sociales.service";
import {ConfirmService} from "../../../../_servicios/confirm.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";

@Component({
  selector: 'ver-os',
  templateUrl: 'ver-modificar-obra-social.component.html',
  styleUrls: ['ver-modificar-obra-social.component.css']
})

export class VerModificarObraSocial implements OnInit, OnDestroy {

  obra: ObraSocial;
  model: any = {};
  edicion: boolean = false;

  constructor (
    private obraSocialService: ObrasSocialesService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router,
    private confirmarService: ConfirmService,
    private viewContainerRef: ViewContainerRef,
    private spinner: SpinnerService
  ) {}

  ngOnInit(){
    this.route.params.switchMap((params: Params) => this.obraSocialService.get(+params['id']))
      .subscribe((os: ObraSocial) => {
      this.obra = os;
      this.model = os;
      this.spinner.stop();
    }, error => {
        const body = error.json();
        const err = body.error || JSON.stringify(body);
        let mensajeError = JSON.parse(err);
        this.notificationService.error('Error', mensajeError.mensaje);
        this.spinner.stop();
      });
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  modificar(){
    this.spinner.start();
    this.obraSocialService.put(this.model.id, this.model.nombre).subscribe(() => {
      this.notificationService.success('OK', 'Obra social modificada!');
      this.edicion = false;
      this.spinner.stop();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationService.error('Error', mensajeError.mensaje);
      this.edicion = false;
      this.spinner.stop();
    });
  }

  borrar(){
    let mensaje = 'Está seguro que desea eliminar la Obra Social ' + this.obra.nombre + '?';
    this.confirmarService.confirm('Confirmar', mensaje, this.viewContainerRef).subscribe(res => {
      if (res){
        this.obraSocialService.del(this.obra.id).subscribe(() => {
          this.notificationService.success('OK', 'Obra social eliminada!');
          this.router.navigate(['/configuracion/obras-sociales']);
        }, error => {
          const body = error.json();
          const err = body.error || JSON.stringify(body);
          let mensajeError = JSON.parse(err);
          this.notificationService.error('Error', mensajeError.mensaje);
        })
      }
    });
  }

  editar(edit: boolean){
    this.edicion = edit;
  }
}
