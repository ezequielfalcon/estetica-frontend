import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../_servicios/spinner.service';
import {Router} from '@angular/router';
import {ObrasSocialesService} from '../../_servicios/datos/obras-sociales.service';
import {NotificationsService} from 'angular2-notifications';
import {ObraSocial} from '../../_modelos/obra_social';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialogo-obras-sociales',
  templateUrl: './dialogo-obras-sociales.component.html',
  styleUrls: ['./dialogo-obras-sociales.component.css']
})
export class DialogoObrasSocialesComponent implements OnInit {

  obras: ObraSocial[] = [];
  search = '';

  constructor(
    private notificationService: NotificationsService,
    private obrasSocialesService: ObrasSocialesService,
    public dialogRef: MdDialogRef<DialogoObrasSocialesComponent>,
    private router: Router,
    private ref: ChangeDetectorRef,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
    this.cargarObras();
    this.ref.markForCheck();
  }

  private cargarObras() {
    this.obrasSocialesService.getAll().subscribe(obrasDb => {
      this.obras = obrasDb;
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


  nuevaOs() {
    this.dialogRef.close(-1);
  }

}
