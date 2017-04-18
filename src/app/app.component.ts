import { Component } from '@angular/core';
import {DarkThemeService} from "./_servicios/dark-theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public darkService: DarkThemeService){}

  private esDarkTheme = this.darkService.esDark;

  public options = {
    position: ["bottom", "right"],
    timeOut: 9000,
  }
}
