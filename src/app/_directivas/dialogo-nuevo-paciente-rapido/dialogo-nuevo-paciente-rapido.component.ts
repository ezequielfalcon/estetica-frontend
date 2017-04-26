import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {NotificationsService} from 'angular2-notifications';
import {MdDialogRef} from '@angular/material';
import {SpinnerService} from '../../_servicios/spinner.service';
import {Router} from '@angular/router';
import {Paciente} from '../../_modelos/paciente';

@Component({
  selector: 'app-dialogo-nuevo-paciente-rapido',
  templateUrl: './dialogo-nuevo-paciente-rapido.component.html',
  styleUrls: ['./dialogo-nuevo-paciente-rapido.component.css']
})
export class DialogoNuevoPacienteRapidoComponent implements OnInit {

  nom = new FormControl();
  ape = new FormControl();
  dni = new FormControl();
  pacientes: Paciente[] = [];
  seachNom = '';
  searchApe = '';
  searchDni = '';
  nuevoPac: any = {};

  constructor(
    private ref: ChangeDetectorRef,
    private pacientesService: PacientesService,
    private notificationService: NotificationsService,
    public dialogRef: MdDialogRef<DialogoNuevoPacienteRapidoComponent>,
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

  ngOnInit() {
    this.cargarPacientes();
  }

  busqueda() {
    this.spinner.start();
    this.pacientesService.buscar(this.seachNom, this.searchApe, this.searchDni).subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  private cargarPacientes() {
    this.pacientesService.getAll().subscribe(pacientesDb => {
      this.pacientes = pacientesDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  crear() {
    this.pacientesService.post(this.seachNom, this.searchApe, this.searchDni,
      this.nuevoPac.tel || ' ', this.nuevoPac.email || ' ',
      this.nuevoPac.fechaNac || '1901-01-01', this.nuevoPac.sexo || 'N', this.nuevoPac.id_os || 7886,
      this.nuevoPac.numero_os || ' ', this.nuevoPac.domicilio || ' ', this.nuevoPac.obvservaciones || ' ', this.nuevoPac.celular || ' ')
      .subscribe(nuevoP => {
        this.notificationService.success('OK', 'Paciente creado con ID ' + nuevoP.id);
        this.dialogRef.close(nuevoP.id);
      }, error => {
        if (error.status === 401) {
          this.notificationService.error('Error', 'Sesión expirada!');
          this.router.navigate(['/login']);
        }
        const body = JSON.parse(error._body);
        this.notificationService.error('Error', body.mensaje);
      });
  }

}
