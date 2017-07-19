import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

  indiceTab: number;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    switch (this.route.snapshot.params['id']) {
      case 'turnos':
        this.indiceTab = 0;
        break;
      case 'tratamientos':
        this.indiceTab = 1;
        break;
      default:
        this.indiceTab = 0;
    }
  }

}
