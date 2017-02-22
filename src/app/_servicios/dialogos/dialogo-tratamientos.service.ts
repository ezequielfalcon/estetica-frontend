import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {DialogoTratamientosComponent} from "../../_directivas/dialogo-tratamientos/dialogo-tratamientos.component";
import {Observable} from "rxjs";

@Injectable()
export class DialogoTratamientosService {

  constructor(private dialog: MdDialog) { }

  seleccionarTratamiento(viewContainerRef: ViewContainerRef) : Observable<number>{

    let dialogRef: MdDialogRef<DialogoTratamientosComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoTratamientosComponent, config);
    return dialogRef.afterClosed();
  }

}
