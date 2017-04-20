import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {DialogoObrasSocialesComponent} from '../../_directivas/dialogo-obras-sociales/dialogo-obras-sociales.component';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoObrasSocialesService {

  constructor(private dialog: MdDialog) { }

  public seleccionarOs(viewContainerRef: ViewContainerRef): Observable<number> {

    let dialogRef: MdDialogRef<DialogoObrasSocialesComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoObrasSocialesComponent, config);
    return dialogRef.afterClosed();
  }

}
