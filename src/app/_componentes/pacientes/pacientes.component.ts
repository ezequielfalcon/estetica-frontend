/**
 * Created by falco on 26/1/2017.
 */
import {Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {Paciente} from "../../_modelos/paciente";
import {PacientesService} from "../../_servicios/datos/pacientes.service";
import {NotificationsService} from "angular2-notifications";
import {Router} from "@angular/router";
import {SpinnerService} from "../../_servicios/spinner.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'pacientes',
  templateUrl: 'pacientes.component.html',
  styleUrls: ['pacientes.component.css']
})

export class PacientesComponent implements OnInit, OnDestroy {

  nom = new FormControl();
  ape = new FormControl();
  dni = new FormControl();

  constructor (
    private pacientesService: PacientesService,
    private notificationService: NotificationsService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private spinner: SpinnerService
  ) {
    this.nom.valueChanges.debounceTime(400).distinctUntilChanged()
      .subscribe((valor) => {
      this.seachNom = valor;
      this.busqueda();
      });
    this.ape.valueChanges.debounceTime(400).distinctUntilChanged()
      .subscribe((valor) => {
        this.searchApe = valor;
        this.busqueda();
      });
    this.dni.valueChanges.debounceTime(400).distinctUntilChanged()
      .subscribe((valor) => {
      this.searchDni = valor;
        this.busqueda();
      });
  }


  pacientes: Paciente[] = [];
  seachNom = "";
  searchApe = "";
  searchDni = "";

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
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  busqueda(){
    this.spinner.start();
    this.pacientesService.buscar(this.seachNom, this.searchApe, this.searchDni).subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  detalles(id: number){
    this.router.navigate(['/pacientes/' + id]);
  }
}
