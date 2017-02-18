/**
 * Created by eze on 30/01/17.
 */
import {Component} from '@angular/core';
import {SpinnerService} from "../../_servicios/spinner.service";
@Component({
  selector: 'spinner-component',
  templateUrl: 'spinner.component.html'
})
export class SpinnerComponent {
  public active: boolean;

  public constructor(spinner: SpinnerService) {
    spinner.status.subscribe((status: boolean) => {
      this.active = status;
    });
  }
}
