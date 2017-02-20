import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';
import {Observable} from "rxjs";
import {DialogoMedicosComponent} from "../../_directivas/dialogo-medicos/dialogo-medicos.component";

@Injectable()
export class DialogoMedicosService {

  constructor(private dialog: MdDialog) { }

  seleccionarMedico(viewContainerRef: ViewContainerRef): Observable<number>{

    let dialogRef: MdDialogRef<DialogoMedicosComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoMedicosComponent, config);
    return dialogRef.afterClosed();
  }

}
