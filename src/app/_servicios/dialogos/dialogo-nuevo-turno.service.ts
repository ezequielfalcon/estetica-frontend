import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoNuevoTurnoComponent} from '../../_directivas/dialogo-nuevo-turno/dialogo-nuevo-turno.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoNuevoTurnoService {

  constructor(private dialog: MdDialog) { }

  public nuevoTurno(viewContainerRef: ViewContainerRef, turnoId: number, consultorioId: number, fecha: string, entreturno: boolean): Observable<number> {

    let dialogRef: MdDialogRef<DialogoNuevoTurnoComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoNuevoTurnoComponent, config);
    dialogRef.componentInstance.turnoId = turnoId;
    dialogRef.componentInstance.consultorioId = consultorioId;
    dialogRef.componentInstance.fechaTurno = fecha;
    dialogRef.componentInstance.entreturno = entreturno;
    return dialogRef.afterClosed();
  }

}
