import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  indiceTab: number;

  ngOnInit() {
    switch (this.route.snapshot.params['id']){
      case 'obras-sociales':
        this.indiceTab = 0;
        break;
      case 'medicos':
        this.indiceTab = 1;
        break;
      case 'tratamientos':
        this.indiceTab = 2;
        break;
      case 'usuarios':
        this.indiceTab = 3;
        break;
      default:
        this.indiceTab = 0;
    }
  }

}
