import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {PacientesService} from '../../../_servicios/datos/pacientes.service';
import {NotificationsService} from 'angular2-notifications';
import {ObrasSocialesService} from '../../../_servicios/datos/obras-sociales.service';
import {ObraSocial} from '../../../_modelos/obra_social';
import {Router, ActivatedRoute} from '@angular/router';
import {SpinnerService} from '../../../_servicios/spinner.service';
import {DialogoObrasSocialesService} from '../../../_servicios/dialogos/dialogo-obras-sociales.service';

@Component({
  selector: 'app-nuevo-paciente',
  templateUrl: './nuevo-paciente.component.html',
  styleUrls: ['./nuevo-paciente.component.css']
})
export class NuevoPacienteComponent implements OnInit, OnDestroy {

  constructor(
    private pacientesService: PacientesService,
    private notif: NotificationsService,
    private osService: ObrasSocialesService,
    private osDialog: DialogoObrasSocialesService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService
  ) { }

  returnUrl: string;

  nuevoPac: any = {};
  osSeleccionada: ObraSocial;

  sexos = [
    {valor: 'M', nombre: 'Masculino'},
    {valor: 'F', nombre: 'Femenino'},
    {valor: 'N', nombre: 'N/A'}
    ];

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pacientes';
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  seleccionarOs() {
    this.osDialog.seleccionarOs(this.viewContainerRef).subscribe(osSeleccionadaDialogo => {
      if (osSeleccionadaDialogo) {
        this.cargarOs(osSeleccionadaDialogo);
      }
    });
  }

  cargarOs(idOs: number) {
    this.osService.get(idOs).subscribe( osDb => {
      this.osSeleccionada = osDb;
    }, error => {
      if (error.status === 401) {
        this.notif.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
    });
  }

  crear() {
    let capNombre = NuevoPacienteComponent.capitalize(this.nuevoPac.nombre);
    let capApellido = NuevoPacienteComponent.capitalize(this.nuevoPac.apellido);
    this.pacientesService.post(capNombre, capApellido,
      this.nuevoPac.documento, this.nuevoPac.tel || ' ', this.nuevoPac.email || ' ',
      this.nuevoPac.fechaNac || '1901-01-01', this.nuevoPac.sexo || 'N', this.osSeleccionada.id || 7886,
      this.nuevoPac.numero_os.toUpperCase() || ' ', this.nuevoPac.domicilio || ' ', this.nuevoPac.obvservaciones || ' ', this.nuevoPac.celular || ' ')
      .subscribe(nuevoP => {
        this.notif.success('OK', 'Paciente creado con ID ' + nuevoP.id);
        this.router.navigate([this.returnUrl]);
    }, error => {
      if (error.status == 401){
        this.notif.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
    });
  }

  cancelar(){
    this.router.navigate([this.returnUrl]);
  }

  static capitalize(texto: string)
  {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

}
