/**
 * Created by eze on 25/01/17.
 */
import {Component, OnInit, OnDestroy} from '@angular/core';
import { LoginService } from "../../_servicios/index";
import { NotificationsService } from "angular2-notifications";
import { Router, ActivatedRoute } from '@angular/router';
import {SpinnerService} from "../../_servicios/spinner.service";
import {CurrentRouteService} from '../../_servicios/current-route.service';


@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  model: any = {};
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private currentRoute: CurrentRouteService,
    private router: Router,
    private loginService: LoginService,
    private notificationSerivce: NotificationsService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(){
    this.loginService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.spinner.stop();
    this.currentRoute.rutaActual = 'login';
  }

  ngOnDestroy(){
    this.spinner.start();
    this.currentRoute.rutaActual = 'nop';
  }

  login() {
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password)
      .subscribe(
        () => {
          this.notificationSerivce.success('OK', 'Sesión iniciada!');
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error => {
          let body = JSON.parse(error._body);
          this.notificationSerivce.error('Error', body.mensaje);
          this.loading = false;
        }
      )
  }
}



