import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoTurnoMedicoComponent} from '../../_directivas/dialogo-turno-medico/dialogo-turno-medico.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

@Injectable()
export class DialogoTurnoMedicoService {

  constructor(private dialog: MdDialog) { }

  verTurno(fecha: string, consultorioId: number, turnoId: number, entreturno: boolean, viewContainerRef: ViewContainerRef){

    let dialogRef: MdDialogRef<DialogoTurnoMedicoComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoTurnoMedicoComponent, config);
    dialogRef.componentInstance.fecha = fecha;
    dialogRef.componentInstance.consultorioId = consultorioId;
    dialogRef.componentInstance.turnoId = turnoId;
    dialogRef.componentInstance.entreturno = entreturno;
    return dialogRef.afterClosed();
  }

}
