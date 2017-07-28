import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Paciente} from '../../_modelos/paciente';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {NotificationsService} from 'angular2-notifications';
import {MdDialogRef} from '@angular/material';
import {SpinnerService} from '../../_servicios/spinner.service';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialogo-pacientes',
  templateUrl: './dialogo-pacientes.component.html',
  styleUrls: ['./dialogo-pacientes.component.css']
})
export class DialogoPacientesComponent implements OnInit {

  nom = new FormControl();
  ape = new FormControl();
  dni = new FormControl();

  constructor(
    private ref: ChangeDetectorRef,
    private pacientesService: PacientesService,
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoPacientesComponent>,
    private spinner: SpinnerService,
    private router: Router
  ) {
    this.spinner.start();
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
  seachNom = '';
  searchApe = '';
  searchDni = '';

  ngOnInit() {
    this.cargarPacientes();
    this.ref.markForCheck();
  }

  busqueda(){
    this.spinner.start();
    this.pacientesService.buscar(this.seachNom, this.searchApe, this.searchDni).subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401){
        this.notificationService.error('Error','Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  private cargarPacientes(){
    this.pacientesService.getAll().subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401){
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

}
