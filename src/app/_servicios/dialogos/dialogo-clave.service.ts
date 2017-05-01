import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoClaveComponent} from '../../_directivas/dialogo-clave/dialogo-clave.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoClaveService {

  constructor(private dialog: MdDialog) { }

  public cambiarClave(viewContainerRef: ViewContainerRef): Observable<any> {

    let dialogRef: MdDialogRef<DialogoClaveComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoClaveComponent, config);
    return dialogRef.afterClosed();
  }

}
