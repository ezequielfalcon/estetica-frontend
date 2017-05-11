import { Component } from '@angular/core';
import {DarkThemeService} from "./_servicios/dark-theme.service";
import {EsMedicoService} from './_servicios/es-medico.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public darkService: DarkThemeService,
    public esMedico: EsMedicoService
  ){}

  public options = {
    position: ["bottom", "right"],
    timeOut: 2500,
  };

  public temaOscuro() {
    this.darkService.esDark = !this.darkService.esDark;
  }
}
