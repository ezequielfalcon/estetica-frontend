import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {ConfirmService} from "../../../_servicios/confirm.service";
import {SpinnerService} from "../../../_servicios/spinner.service";
import {Consultorio} from "../../../_modelos/consultorio";
import {ConsultoriosService} from "../../../_servicios/datos/consultorios.service";

@Component({
  selector: 'app-ver-modificar-consultorio',
  templateUrl: './ver-modificar-consultorio.component.html',
  styleUrls: ['./ver-modificar-consultorio.component.css']
})
export class VerModificarConsultorioComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router,
    private confirmarService: ConfirmService,
    private viewContainerRef: ViewContainerRef,
    private spinner: SpinnerService,
    private consultoriosService: ConsultoriosService
  ) { }

  consul: Consultorio;
  model: any = {};
  edicion: boolean = false;

  ngOnInit() {
    this.route.params.switchMap((params: Params) => this.consultoriosService.getById(+params['id']))
      .subscribe((consul: Consultorio) => {
        this.consul = consul;
        this.model = consul;
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

  borrar(){
    let mensaje = 'Está seguro que desea eliminar el Consultorio ' + this.consul.nombre + '? ';
    this.confirmarService.confirm('Confirmar', mensaje, this.viewContainerRef).subscribe(res => {
      if (res){
        this.consultoriosService.del(this.consul.id).subscribe(() => {
          this.notificationService.success('OK', 'Consultorio eliminado!');
          this.router.navigate(['/configuracion/consultorios']);
        }, error => {
          const body = error.json();
          const err = body.error || JSON.stringify(body);
          let mensajeError = JSON.parse(err);
          this.notificationService.error('Error', mensajeError.mensaje);
        })
      }
    });
  }

  modificar(){
    this.spinner.start();
    this.consultoriosService.put(this.model.id, this.model.nombre).subscribe(() => {
      this.notificationService.success('OK', 'Consultorio modificado!');
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

  editar(edit: boolean){
    this.edicion = edit;
  }

}
