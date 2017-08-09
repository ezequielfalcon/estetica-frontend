import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoNuevaHistoriaComponent} from '../../_directivas/dialogo-nueva-historia/dialogo-nueva-historia.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoNuevaHistoriaService {

  constructor(private dialog: MdDialog) { }

  cargarHistoria(agendaId: number, viewContainerRef: ViewContainerRef): Observable<number> {
    let dialogRef: MdDialogRef<DialogoNuevaHistoriaComponent>;
    const config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoNuevaHistoriaComponent, config);
    dialogRef.componentInstance.agendaId = agendaId;
    return dialogRef.afterClosed();
  }

}
