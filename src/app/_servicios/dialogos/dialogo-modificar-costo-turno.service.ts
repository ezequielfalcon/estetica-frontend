import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoModificarCostoTurnoComponent} from "../../_directivas/dialogo-modificar-costo-turno/dialogo-modificar-costo-turno.component";
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DialogoModificarCostoTurnoService {

  constructor(private dialog: MdDialog) { }

  public modificarCosto(viewContainerRef: ViewContainerRef, agendaId: number, costoAnterior: number): Observable<any> {

    let dialogRef: MdDialogRef<DialogoModificarCostoTurnoComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoModificarCostoTurnoComponent, config);
    dialogRef.componentInstance.agendaId = agendaId;
    dialogRef.componentInstance.costoAnterior = costoAnterior;
    return dialogRef.afterClosed();
  }

}
