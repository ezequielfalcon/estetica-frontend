import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {CuentaCorrienteService} from '../../_servicios/datos/cuenta-corriente.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {SpinnerService} from '../../_servicios/spinner.service';

@Component({
  selector: 'app-dialogo-ctacte',
  templateUrl: './dialogo-ctacte.component.html',
  styleUrls: ['./dialogo-ctacte.component.css']
})
export class DialogoCtacteComponent implements OnInit {

  public pacienteId: number;

  nuevoMovimiento: any = {};

  constructor(
    public dialogRef: MdDialogRef<DialogoCtacteComponent>,
    private ctacteService: CuentaCorrienteService,
    private notificationSerivce: NotificationsService,
    private spinner: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  guardarMovimiento(esPago: boolean) {
    this.spinner.start();
    const monto = esPago ? this.nuevoMovimiento.monto * -1 : this.nuevoMovimiento.monto;
    this.ctacteService.nuevoMovimiento(this.pacienteId, this.nuevoMovimiento.concepto, monto)
      .subscribe(() => {
        this.dialogRef.close();
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

}
