import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoHistoriaComponent} from '../../_directivas/dialogo-historia/dialogo-historia.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';

@Injectable()
export class DialogoHistoriaService {

  constructor(private dialog: MdDialog) { }

  verHistoria(agendaId: number, viewContainerRef: ViewContainerRef) {
    let dialogRef: MdDialogRef<DialogoHistoriaComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoHistoriaComponent, config);
    dialogRef.componentInstance.idAgenda = agendaId;
    return dialogRef.afterClosed();
  }

}
