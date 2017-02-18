/**
 * Created by falco on 27/1/2017.
 */
import {Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import { ObraSocial } from '../../_modelos/index';
import {ObrasSocialesService} from "../../_servicios/datos/obras-sociales.service";
import {Router} from "@angular/router";
import {SpinnerService} from "../../_servicios/spinner.service";

@Component({
  selector: 'obra-social',
  templateUrl: 'obras-sociales.component.html',
  styleUrls: ['obras-sociales.component.css']
})

export class ObrasSocialesComponent implements OnInit, OnDestroy {
  constructor (
    private notificationService: NotificationsService,
    private obrasSocialesService: ObrasSocialesService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private spinner: SpinnerService
  ) {}

  obras: ObraSocial[] = [];
  search: string = "";

  cargando = true;

  ngOnInit(){
    this.cargarObras();
    this.ref.markForCheck();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  private cargarObras(){
    this.obrasSocialesService.getAll().subscribe(obrasDb => { this.obras = obrasDb; this.spinner.stop() }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationService.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
    this.cargando = false;
  }

  private detalles(id: number){
    this.router.navigate(['/obras-sociales/' + id]);
  }
}
