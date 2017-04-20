import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {MedicosService} from '../../../_servicios/datos/medicos.service';
import {SpinnerService} from '../../../_servicios/spinner.service';
import {Medico} from '../../../_modelos/medico';

@Component({
  selector: 'app-medicos',
  templateUrl: 'medicos.component.html',
  styleUrls: ['medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  medicos: Medico[] = [];
  search = '';
  searchApe = '';

  constructor(
    private medicosService: MedicosService,
    private notificationService: NotificationsService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
    this.ref.markForCheck();
  }

  ngOnDestroy() {
    this.spinner.start();
  }

  cargarMedicos() {
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
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

  detalles(id: number) {
    this.router.navigate(['/medicos/' + id]);
  }

}
