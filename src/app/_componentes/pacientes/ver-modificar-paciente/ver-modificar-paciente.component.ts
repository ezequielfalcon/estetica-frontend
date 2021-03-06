import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {ObraSocial} from "../../../_modelos/obra_social";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ObrasSocialesService} from "../../../_servicios/datos/obras-sociales.service";
import {NotificationsService} from "angular2-notifications";
import {PacientesService} from "../../../_servicios/datos/pacientes.service";
import {Paciente} from "../../../_modelos/paciente";
import {ConfirmService} from "../../../_servicios/confirm.service";
import {SpinnerService} from "../../../_servicios/spinner.service";

@Component({
  selector: 'app-ver-modificar-paciente',
  templateUrl: './ver-modificar-paciente.component.html',
  styleUrls: ['./ver-modificar-paciente.component.css']
})
export class VerModificarPacienteComponent implements OnInit, OnDestroy {

  constructor(
    private pacientesService: PacientesService,
    private notif: NotificationsService,
    private os: ObrasSocialesService,
    private route: ActivatedRoute,
    private confirmarService: ConfirmService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private spinner: SpinnerService
  ) { }

  obras: ObraSocial[] = [];
  returnUrl: string;
  edicion: boolean = false;
  pac: any = {};
  edad = 0;

  sexos = [
    {valor: 'M', nombre: 'Masculino'},
    {valor: 'F', nombre: 'Femenino'},
    {valor: 'N', nombre: 'N/A'}
  ];

  calcularEdad(fecha: string) { // birthday is a date
    let nuevaFecha = new Date(fecha);
    let ageDifMs = Date.now() - nuevaFecha.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  cambiarFecha() {
    this.edad = this.calcularEdad(this.pac.fecha_nacimiento);
  }

  ngOnInit() {
    this.cargarObras();
    this.route.params.switchMap((params: Params) => this.pacientesService.getById(+params['id']))
      .subscribe((pachiente: Paciente) => {
      this.pac = pachiente;
      if (pachiente.fecha_nacimiento) this.pac.fecha_nacimiento = pachiente.fecha_nacimiento.substr(0,10);
      if (pachiente.fecha_alta) this.pac.fecha_alta = pachiente.fecha_alta.substr(0,10);
      this.edad = this.calcularEdad(this.pac.fecha_nacimiento);
      this.spinner.stop();
      }, error => {
        if (error.status == 401){
          this.notif.error("Error","Sesión expirada!");
          this.router.navigate(['/login']);
        }
        let body = JSON.parse(error._body);
        this.notif.error('Error', body.mensaje);
        this.spinner.stop();
      });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pacientes';
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cargarObras(){
    this.os.getAll().subscribe(obrasDb => { this.obras = obrasDb }, error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  editar(edit: boolean){
    this.edicion = edit;
  }

  modificar(){
    this.pacientesService.put(this.pac.id, this.pac.nombre, this.pac.apellido,
      this.pac.documento, this.pac.telefono || ' ', this.pac.mail || ' ', this.pac.fecha_nacimiento,
      this.pac.sexo, this.pac.id_os, this.pac.numero_os.toUpperCase() || ' ', this.pac.domicilio || ' ', this.pac.obvservaciones || ' ', this.pac.celular || ' ')
      .subscribe(() => {
      this.notif.success('OK', 'Paciente modificado!');
      this.edicion = false;
    }, error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.edicion = false;
    });
  }

  borrar(){
    let mensaje = 'Está seguro que desea eliminar el Paciente ' + this.pac.nombre + ' ' + this.pac.apellido + '?';
    this.confirmarService.confirm('Confirmar', mensaje, this.viewContainerRef).subscribe(res => {
      if (res){
        this.pacientesService.del(this.pac.id).subscribe(() => {
          this.notif.success('OK', 'Paciente eliminado!');
          this.router.navigate(['/pacientes']);
        }, error => {
          if (error.status == 401){
            this.notif.error("Error","Sesión expirada!");
            this.router.navigate(['/login']);
          }
          let body = JSON.parse(error._body);
          this.notif.error('Error', body.mensaje);
        });
      }
    });
  }

}
