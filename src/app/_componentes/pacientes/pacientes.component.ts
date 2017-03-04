/**
 * Created by falco on 26/1/2017.
 */
import {Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit} from "@angular/core";
import {Paciente} from "../../_modelos/paciente";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {NotificationsService} from "angular2-notifications";
import {Router} from "@angular/router";
import {SpinnerService} from "../../_servicios/spinner.service";

@Component({
  selector: 'pacientes',
  templateUrl: 'pacientes.component.html',
  styleUrls: ['pacientes.component.css']
})

export class PacientesComponent implements OnInit, OnDestroy {
  constructor (
    private pacientesService: PacientesService,
    private notificationSerivce: NotificationsService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private spinner: SpinnerService
  ) {}


  pacientes: Paciente[] = [];
  search: string = "";
  searchDni: string = "";
  searchApe: string = "";

  ngOnInit(){
    this.cargarPacientes();
    this.ref.markForCheck();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  private cargarPacientes(){
    this.pacientesService.getAll().subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      let body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  detalles(id: number){
    this.router.navigate(['/pacientes/' + id]);
  }
}
