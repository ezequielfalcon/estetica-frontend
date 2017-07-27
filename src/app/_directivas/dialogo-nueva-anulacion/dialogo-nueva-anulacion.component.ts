import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {MedicosService} from '../../_servicios/datos/medicos.service';
import {SpinnerService} from '../../_servicios/spinner.service';
import {NotificationsService} from 'angular2-notifications';
import {MdDialogRef} from '@angular/material';
import {Medico} from '../../_modelos/medico';
import {DialogoMedicosService} from '../../_servicios/dialogos/dialogo-medicos.service';
import {Horario} from '../../_modelos/horario';
import {TurnosService} from '../../_servicios/datos/turnos.service';

@Component({
  selector: 'app-dialogo-nueva-anulacion',
  templateUrl: './dialogo-nueva-anulacion.component.html',
  styleUrls: ['./dialogo-nueva-anulacion.component.css']
})
export class DialogoNuevaAnulacionComponent implements OnInit {

  medicoSeleccionado: Medico;
  medicoSeleccionadoBool = false;
  horarios: Horario[] = [];
  nuevaAusencia: any = {};

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private medicosService: MedicosService,
    private router: Router,
    public dialogRef: MdDialogRef<DialogoNuevaAnulacionComponent>,
    private dialogoMedicos: DialogoMedicosService,
    private viewContainerRef: ViewContainerRef,
    private turnosService: TurnosService
  ) { }

  ngOnInit() {
    this.cargarHorarios();
  }

  cargarMedico(medicoId) {
    this.medicosService.getById(medicoId).subscribe(medicoDb => {
      this.medicoSeleccionado = medicoDb;
      this.medicoSeleccionadoBool = true;
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
    this.spinner.start();
    if (!this.nuevaAusencia.observaciones) {
      this.nuevaAusencia.observaciones = ' ';
    }
    this.medicosService.nuevaAnulacion(this.medicoSeleccionado.id, this.nuevaAusencia.fechaAnul,
      this.nuevaAusencia.horaDesde, this.nuevaAusencia.horaHasta, this.nuevaAusencia.observaciones)
      .subscribe(nuevaAnulDb => {
        this.spinner.stop();
        this.notificationService.success('OK', 'Anulación creada');
        this.dialogRef.close(nuevaAnulDb);
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

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
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

  seleccionarMedico() {
    this.spinner.start();
    this.dialogoMedicos.seleccionarMedico(this.viewContainerRef)
      .subscribe(medicoSeleccionado => {
        if (medicoSeleccionado) {
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

}
