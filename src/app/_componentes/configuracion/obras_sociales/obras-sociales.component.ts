/**
 * Created by falco on 27/1/2017.
 */
import {Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {Router} from "@angular/router";
import {ObrasSocialesService} from "../../../_servicios/datos/obras-sociales.service";
import {SpinnerService} from "../../../_servicios/spinner.service";
import {ObraSocial} from "../../../_modelos/obra_social";

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
    this.obrasSocialesService.getAll().subscribe(obrasDb =>
    {
      this.obras = obrasDb; this.spinner.stop()
    }, error =>
    {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
    this.cargando = false;
  }

  private detalles(id: number){
    this.router.navigate(['/obras-sociales/' + id]);
  }
}
