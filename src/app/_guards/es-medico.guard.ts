import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {NotificationsService} from "angular2-notifications";

@Injectable()
export class EsMedicoGuard implements CanActivate {

  constructor(
    private notif: NotificationsService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    if (localStorage.getItem("rol") == "medico"){
      return true;
    }
    this.notif.error("Error de acceso", "Sólo los médicos pueden acceder a esta página!");
    return false;
  }
}
