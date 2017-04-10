import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialogo-ctacte',
  templateUrl: './dialogo-ctacte.component.html',
  styleUrls: ['./dialogo-ctacte.component.css']
})
export class DialogoCtacteComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<DialogoCtacteComponent>) { }

  nuevoMovimiento: any = {};

  ngOnInit() {
  }

}
