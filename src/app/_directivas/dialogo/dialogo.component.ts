/**
 * Created by eze on 28/01/17.
 */

import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'dialogo.component.html'
})
export class DialogoComponent {

  public title: string;
  public message: string;

  constructor(public dialogRef: MdDialogRef<DialogoComponent>) {

  }
}
