import { Component, OnInit } from '@angular/core';
import {Tratamiento} from "../../_modelos/tratamiento";

@Component({
  selector: 'app-tratamientos',
  templateUrl: './tratamientos.component.html',
  styleUrls: ['./tratamientos.component.css']
})
export class TratamientosComponent implements OnInit {

  constructor() { }

  tratamientos: Tratamiento[]=[];

  ngOnInit() {
  }

}
