import {Injectable, ViewContainerRef} from '@angular/core';
import {DialogoNuevoPacienteComponent} from '../../_directivas/dialogo-nuevo-paciente/dialogo-nuevo-paciente.component';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DialogoNuevoPacienteService {

  constructor(private dialog: MdDialog) { }

  public crearPaciente(viewContainerRef: ViewContainerRef): Observable<number> {

    let dialogRef: MdDialogRef<DialogoNuevoPacienteComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoNuevoPacienteComponent, config);
    return dialogRef.afterClosed();
  }

}
