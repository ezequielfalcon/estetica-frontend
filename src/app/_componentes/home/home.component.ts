/**
 * Created by falco on 26/1/2017.
 */
import {Component, OnInit, OnDestroy} from "@angular/core";
import {SpinnerService} from "../../_servicios/spinner.service";

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  constructor (
    private spinner: SpinnerService
  ) {}

  ngOnInit(){
    this.spinner.stop();
  }

  ngOnDestroy(){
    this.spinner.start();
  }
}
