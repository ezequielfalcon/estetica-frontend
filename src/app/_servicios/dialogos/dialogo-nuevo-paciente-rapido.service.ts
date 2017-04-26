import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoNuevoPacienteRapidoComponent} from "../../_directivas/dialogo-nuevo-paciente-rapido/dialogo-nuevo-paciente-rapido.component";
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DialogoNuevoPacienteRapidoService {

  constructor(private dialog: MdDialog) { }

  public seleccionarCearPaciente(viewContainerRef: ViewContainerRef): Observable<number> {

    let dialogRef: MdDialogRef<DialogoNuevoPacienteRapidoComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoNuevoPacienteRapidoComponent, config);
    return dialogRef.afterClosed();
  }

}
