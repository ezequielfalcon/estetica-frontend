import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoNuevaObraSocialComponent} from '../../_directivas/dialogo-nueva-obra-social/dialogo-nueva-obra-social.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoNuevaObraSocialService {

  constructor(private dialog: MdDialog) { }

  public crearOs(viewContainerRef: ViewContainerRef): Observable<number> {

    let dialogRef: MdDialogRef<DialogoNuevaObraSocialComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoNuevaObraSocialComponent, config);
    return dialogRef.afterClosed();
  }

}
