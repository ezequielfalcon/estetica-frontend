import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoHistoriaComponent} from '../../_directivas/dialogo-historia/dialogo-historia.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoHistoriaService {

  constructor(private dialog: MdDialog) { }

  verHistoria(agendaId: number, viewContainerRef: ViewContainerRef): Observable<number> {
    let dialogRef: MdDialogRef<DialogoHistoriaComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoHistoriaComponent, config);
    dialogRef.componentInstance.idAgenda = agendaId;
    return dialogRef.afterClosed();
  }

}
