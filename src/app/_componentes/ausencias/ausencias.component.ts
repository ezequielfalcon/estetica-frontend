import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Anulacion} from '../../_modelos/anulacion';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {Horario} from '../../_modelos/horario';
import {TurnosService} from '../../_servicios/datos/turnos.service';
import {ConfirmService} from '../../_servicios/confirm.service';
import {DialogoNuevaAnulacionService} from "../../_servicios/dialogos/dialogo-nueva-anulacion.service";

@Component({
  selector: 'app-ausencias',
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css']
})
export class AusenciasComponent implements OnInit, OnDestroy {

  anulaciones: Anulacion[] = [];
  horarios: Horario[] = [];

  constructor(
    private medicosService: MedicosService,
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService,
    private confirmar: ConfirmService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private nuevaAusenciaDialog: DialogoNuevaAnulacionService
  ) { }

  ngOnInit() {
    this.cargarHorarios();
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
      this.cargarAnulaciones();
    }, error => {
      if (error.status === 401) {
        this.notificationSerivce.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarAnulaciones() {
    this.medicosService.verAnulaciones().subscribe(anulacionesDb => {
      this.anulaciones = anulacionesDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationSerivce.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationSerivce.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }


  borrar(anulacionId: number) {
    this.confirmar.confirm('Eliminar ausencia programada?',
      'Confirme si decea eliminar la ausencia programada para el médico/a ', this.viewContainerRef)
      .subscribe(resultado => {
        if (resultado === true) {
          this.spinner.start();
          this.medicosService.borrarAnulacion(anulacionId).subscribe( () => {
            this.cargarAnulaciones();
            this.spinner.stop();
            this.notificationSerivce.success('OK', 'Asistencia programada eliminada!');
          }, error => {
            if (error.status === 401) {
              this.notificationSerivce.error('Error', 'Sesión expirada!');
              this.router.navigate(['/login']);
            }
            const body = JSON.parse(error._body);
            this.notificationSerivce.error('Error', body.mensaje);
            this.spinner.stop();
          });
        }
      });
  }

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

  crearAusencia() {
    this.nuevaAusenciaDialog.crearAnulacion(this.viewContainerRef).subscribe(nuevaAusenciaDb => {
      if (nuevaAusenciaDb) {
        this.cargarAnulaciones();
      }
    });
  }

}
