/**
 * Created by falco on 26/1/2017.
 */
import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {SpinnerService} from "../../_servicios/spinner.service";
import {DarkThemeService} from "../../_servicios/dark-theme.service";
import {DialogoClaveService} from "../../_servicios/dialogos/dialogo-clave.service";

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  constructor (
    private spinner: SpinnerService,
    private dark: DarkThemeService,
    private cambiarClaveService: DialogoClaveService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(){
    this.spinner.stop();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cambiarClave() {
    this.cambiarClaveService.cambiarClave(this.viewContainerRef);
  }

  oscuro(){
    this.dark.esDark = !this.dark.esDark;
  }
}
