import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {DialogoTurnoComponent} from "../../_directivas/dialogo-turno/dialogo-turno.component";

@Injectable()
export class DialogoTurnoService {

  constructor(private dialog: MdDialog) { }

  verTurno(fecha: string, consultorioId: number, turnoId: number, viewContainerRef: ViewContainerRef){

    let dialogRef: MdDialogRef<DialogoTurnoComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoTurnoComponent, config);
    dialogRef.componentInstance.fecha = fecha;
    dialogRef.componentInstance.consultorioId = consultorioId;
    dialogRef.componentInstance.turnoId = turnoId;
    return dialogRef.afterClosed();
  }

}
