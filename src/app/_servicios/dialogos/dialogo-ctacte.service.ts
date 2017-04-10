import {Injectable, ViewContainerRef} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {DialogoCtacteComponent} from "../../_directivas/dialogo-ctacte/dialogo-ctacte.component";
import {Observable} from "rxjs";

@Injectable()
export class DialogoCtacteService {

  constructor(private dialog: MdDialog) { }

  public nuevoMovimiento(viewContainerRef: ViewContainerRef) : Observable<boolean> {
    let dialogRef: MdDialogRef<DialogoCtacteComponent>;
    let config = new MdDialogConfig();
    config.viewContainerRef = viewContainerRef;
    dialogRef = this.dialog.open(DialogoCtacteComponent, config);
    return dialogRef.afterClosed();
  }

}
