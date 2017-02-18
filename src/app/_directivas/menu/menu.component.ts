/**
 * Created by falco on 27/1/2017.
 */

import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'menu-estetica',
  templateUrl: 'menu.component.html'
})

export class MenuComponent implements OnInit {
  usuarioLogueado: string = "";
  usuarioLogueadoBool : boolean = false;

  ngOnInit(){
    if (localStorage.getItem('token')){
      this.usuarioLogueado = localStorage.getItem('usuario');
      this.usuarioLogueadoBool = true;
    }
  }
}
