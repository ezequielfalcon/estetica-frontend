import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {IColorPickerConfiguration} from "ng2-color-picker";
import {ConfirmService} from "../../../../_servicios/confirm.service";
import {SpinnerService} from "../../../../_servicios/spinner.service";
import {MedicosService} from "../../../../_servicios/datos/medicos.service";
import {Medico} from "../../../../_modelos/medico";

@Component({
  selector: 'app-ver-modificar-medico',
  templateUrl: 'ver-modificar-medico.component.html',
  styleUrls: ['ver-modificar-medico.component.css']
})
export class VerModificarMedicoComponent implements OnInit, OnDestroy {

  public configColores: IColorPickerConfiguration;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router,
    private confirmarService: ConfirmService,
    private viewContainerRef: ViewContainerRef,
    private spinner: SpinnerService,
    private medicService: MedicosService
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

  medico: Medico;
  model: any = {};
  edicion: boolean = false;
  returnUrl: string;


  ngOnInit() {
    this.route.params.switchMap((params: Params) => this.medicService.getById(+params['id']))
      .subscribe((med: Medico) => {
        this.medico = med;
        this.model = med;
        this.spinner.stop();
      }, error => {
        let body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
        this.spinner.stop();
      });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/configuracion/medicos';
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  volver(){
    this.router.navigate([this.returnUrl]);
  }

  modificar(){
    this.spinner.start();
    this.medicService.put(this.model.id, this.model.nombre, this.model.apellido, this.model.mail, this.model.color).subscribe(() => {
      this.notificationService.success('OK', 'Médico modificado!');
      this.edicion = false;
      this.spinner.stop();
    }, error => {
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.edicion = false;
      this.spinner.stop();
    });
  }

  borrar(){
    let mensaje = 'Está seguro que desea eliminar la Obra Social ' + this.model.nombre + ' ' + this.model.apellido + '?';
    this.confirmarService.confirm('Confirmar', mensaje, this.viewContainerRef).subscribe(res => {
      if (res){
        this.medicService.del(this.model.id).subscribe(() => {
          this.notificationService.success('OK', 'Medico eliminado!');
          this.router.navigate(['/configuracion/medicos']);
        }, error => {
          let body = JSON.parse(error._body);
          this.notificationService.error('Error', body.mensaje);
        })
      }
    });
  }

  editar(edit: boolean){
    this.edicion = edit;
  }

}
