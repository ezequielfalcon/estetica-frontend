import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {DialogoAnulacionesComponent} from '../../_directivas/dialogo-anulaciones/dialogo-anulaciones.component';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoAnulacionesService {

  constructor(private dialog: MdDialog) { }

  public verAnulaciones(viewContainerRef: ViewContainerRef, fecha: string): Observable<any> {
    let dialogRef: MdDialogRef<DialogoAnulacionesComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoAnulacionesComponent, config);
    dialogRef.componentInstance.fechaAnulaciones = fecha;
    return dialogRef.afterClosed();
  }

}
