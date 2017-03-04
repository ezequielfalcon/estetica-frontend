import {Component, OnInit, OnDestroy} from '@angular/core';
import {PacientesService} from "../../../_servicios/datos/pacientes.service";
import {NotificationsService} from "angular2-notifications";
import {ObrasSocialesService} from "../../../_servicios/datos/obras-sociales.service";
import {ObraSocial} from "../../../_modelos/obra_social";
import {Router, ActivatedRoute} from "@angular/router";
import {SpinnerService} from "../../../_servicios/spinner.service";

@Component({
  selector: 'app-nuevo-paciente',
  templateUrl: './nuevo-paciente.component.html',
  styleUrls: ['./nuevo-paciente.component.css']
})
export class NuevoPacienteComponent implements OnInit, OnDestroy {

  constructor(
    private pacientesService: PacientesService,
    private notif: NotificationsService,
    private os: ObrasSocialesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pacientes';
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cargarObras(){
    this.os.getAll().subscribe(obrasDb => { this.obras = obrasDb; this.spinner.stop() }, error => {
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  crear(){
    this.pacientesService.post(this.nuevoPac.nombre, this.nuevoPac.apellido,
      this.nuevoPac.documento, this.nuevoPac.tel, this.nuevoPac.email,
      this.nuevoPac.fechaNac, this.nuevoPac.sexo, this.nuevoPac.id_os ).subscribe(nuevoP => {
        this.notif.success('OK', 'Paciente creado con ID ' + nuevoP.id);
        this.router.navigate([this.returnUrl]);
    }, error => {
      let body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
    });
  }

  cancelar(){
    this.router.navigate([this.returnUrl]);
  }

}
