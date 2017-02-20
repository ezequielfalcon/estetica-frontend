import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable, ViewContainerRef } from '@angular/core';
import {Observable} from "rxjs";
import {DialogoPacientesComponent} from "../../_directivas/dialogo-pacientes/dialogo-pacientes.component";

@Injectable()
export class DialogoPacientesService {

  constructor(private dialog: MdDialog) { }

  public seleccionarPaciente(viewContainerRef: ViewContainerRef): Observable<number> {

    let dialogRef: MdDialogRef<DialogoPacientesComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoPacientesComponent, config);
    return dialogRef.afterClosed();
  }

}
