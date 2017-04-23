import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {DialogoNuevaAnulacionComponent} from '../../_directivas/dialogo-nueva-anulacion/dialogo-nueva-anulacion.component';

@Injectable()
export class DialogoNuevaAnulacionService {

  constructor(private dialog: MdDialog) { }

  public crearAnulacion(viewContainerRef: ViewContainerRef): Observable<number> {

    let dialogRef: MdDialogRef<DialogoNuevaAnulacionComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoNuevaAnulacionComponent, config);
    return dialogRef.afterClosed();
  }

}
