import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {DialogoTurnoComponent} from "../../_directivas/dialogo-turno/dialogo-turno.component";

@Injectable()
export class DialogoTurnoService {

  constructor(private dialog: MdDialog) { }

  verTurno(viewContainerRef: ViewContainerRef){

    let dialogRef: MdDialogRef<DialogoTurnoComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoTurnoComponent, config);
    return dialogRef.afterClosed();
  }

}
