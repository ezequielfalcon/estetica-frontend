import { Component, OnInit } from '@angular/core';
import {ObraSocial} from '../../_modelos/obra_social';
import {SpinnerService} from '../../_servicios/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ObrasSocialesService} from '../../_servicios/datos/obras-sociales.service';
import {NotificationsService} from 'angular2-notifications';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialogo-nuevo-paciente',
  templateUrl: './dialogo-nuevo-paciente.component.html',
  styleUrls: ['./dialogo-nuevo-paciente.component.css']
})
export class DialogoNuevoPacienteComponent implements OnInit {

  constructor(
    private pacientesService: PacientesService,
    private notif: NotificationsService,
    private os: ObrasSocialesService,
    private router: Router,
    private spinner: SpinnerService,
    public dialogRef: MdDialogRef<DialogoNuevoPacienteComponent>
  ) { }

  obras: ObraSocial[] = [];
  returnUrl: string;

  nuevoPac: any = {};

  sexos = [
    {valor: 'M', nombre: 'Masculino'},
    {valor: 'F', nombre: 'Femenino'},
    {valor: 'N', nombre: 'N/A'}
  ];

  ngOnInit() {
    this.cargarObras();
  }

  cargarObras(){
    this.os.getAll().subscribe(obrasDb => { this.obras = obrasDb; this.spinner.stop() }, error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  crear(){
    this.pacientesService.post(this.nuevoPac.nombre, this.nuevoPac.apellido,
      this.nuevoPac.documento, this.nuevoPac.tel || ' ', this.nuevoPac.email || ' ',
      this.nuevoPac.fechaNac || '1901-01-01', this.nuevoPac.sexo || 'N', this.nuevoPac.id_os || 7359,
      this.nuevoPac.numero_os || ' ', this.nuevoPac.domicilio || ' ', this.nuevoPac.obvservaciones || ' ')
      .subscribe(nuevoP => {
        this.notif.success('OK', 'Paciente creado con ID ' + nuevoP.id);
        this.dialogRef.close(nuevoP.id);
      }, error => {
        if (error.status == 401){
          this.notif.error("Error","Sesión expirada!");
          this.router.navigate(['/login']);
        }
        let body = JSON.parse(error._body);
        this.notif.error('Error', body.mensaje);
      });
  }

}
