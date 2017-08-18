import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Medico} from '../../../_modelos/medico';
import {TurnoMedicoResumen} from '../../../_modelos/turno-medico-resumen';
import {DialogoMedicosService} from '../../../_servicios/dialogos/dialogo-medicos.service';
import {Router} from '@angular/router';
import {MedicosService} from '../../../_servicios/datos/medicos.service';
import {SpinnerService} from '../../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-turnos-por-medico',
  templateUrl: './turnos-por-medico.component.html',
  styleUrls: ['./turnos-por-medico.component.css']
})
export class TurnosPorMedicoComponent implements OnInit {

  medicoSeleccionado: Medico;
  medicoSeleccionadoBool = false;
  turnos: TurnoMedicoResumen[] = [];

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private router: Router,
    private dialogoMedicos: DialogoMedicosService,
    private viewContainerRef: ViewContainerRef,
    private medicosService: MedicosService
  ) { }

  ngOnInit() {
  }

  seleccionarMedico() {
    this.spinner.start();
    this.dialogoMedicos.seleccionarMedico(this.viewContainerRef)
      .subscribe(medicoSeleccionado => {
        if (medicoSeleccionado) {
          this.spinner.start();
          this.cargarMedico(medicoSeleccionado);
        }
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

  cargarMedico(medicoId) {
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medicoSeleccionado = medicoDb;
      this.medicoSeleccionadoBool = true;
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

  otroMedico() {
    this.medicoSeleccionadoBool = false;
    this.seleccionarMedico();
  }

  cargarTurnos(medicoId:number , fechaOld: string, fechaNew: string) {

  }

}
