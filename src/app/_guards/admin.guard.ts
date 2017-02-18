/**
 * Created by falco on 30/1/2017.
 */
import {Injectable} from "@angular/core";
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {NotificationsService} from "angular2-notifications";


@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private notif: NotificationsService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (localStorage.getItem('token') && localStorage.getItem('rol') == 'admin'){
      return true;
    }
    this.notif.error('Error de acceso', 'No tiene permiso para acceder a esa opción');
  }

}
