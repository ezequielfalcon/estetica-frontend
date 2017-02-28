import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {ConfirmService} from "../../../../_servicios/confirm.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";
import {TratamientosService} from "../../../../_servicios/datos/tratamientos.service";
import {Tratamiento} from "../../../../_modelos/tratamiento";

@Component({
  selector: 'app-ver-modificar-tratamiento',
  templateUrl: 'ver-modificar-tratamiento.component.html',
  styleUrls: ['ver-modificar-tratamiento.component.css']
})
export class VerModificarTratamientoComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router,
    private confirmarService: ConfirmService,
    private viewContainerRef: ViewContainerRef,
    private spinner: SpinnerService,
    private tratamientosService: TratamientosService
  ) { }

  tratamiento: any = {};
  edicion: boolean = false;

  ngOnInit() {
    this.route.params.switchMap((params: Params) => this.tratamientosService.getById(+params['id']))
      .subscribe((trat: Tratamiento) => {
        this.tratamiento = trat;
        this.spinner.stop();
      }, error => {
        const body = error.json();
        const err = body.error || JSON.stringify(body);
        let mensajeError = JSON.parse(err);
        this.notificationService.error('Error', mensajeError.mensaje);
        this.spinner.stop();
      });
  }

  modificar(){
    this.spinner.start();
    this.tratamientosService.put(this.tratamiento.id, this.tratamiento.nombre, this.tratamiento.costo).subscribe(() => {
      this.notificationService.success('OK', 'Tratamiento modificado!');
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
    let mensaje = 'Está seguro que desea eliminar el Tratamiento ' + this.tratamiento.nombre + '?';
    this.confirmarService.confirm('Confirmar', mensaje, this.viewContainerRef).subscribe(res => {
      if (res){
        this.tratamientosService.del(this.tratamiento.id).subscribe(() => {
          this.notificationService.success('OK', 'Tratamiento eliminado!');
          this.router.navigate(['/configuracion/tratamientos']);
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

  ngOnDestroy(){
    this.spinner.start();
  }

}
