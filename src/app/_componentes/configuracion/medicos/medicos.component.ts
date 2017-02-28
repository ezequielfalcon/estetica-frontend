import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {MedicosService} from "../../../_servicios/datos/medicos.service";
import {SpinnerService} from "../../../_servicios/spinner.service";
import {Medico} from "../../../_modelos/medico";

@Component({
  selector: 'app-medicos',
  templateUrl: 'medicos.component.html',
  styleUrls: ['medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  constructor(
    private medicosService: MedicosService,
    private notificationSerivce: NotificationsService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private spinner: SpinnerService
  ) { }

  medicos: Medico[] = [];
  search: string = "";
  searchApe: string = "";

  ngOnInit() {
    this.cargarMedicos();
    this.ref.markForCheck();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
      this.spinner.stop();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  detalles(id: number){
    this.router.navigate(['/medicos/' + id]);
  }

}
