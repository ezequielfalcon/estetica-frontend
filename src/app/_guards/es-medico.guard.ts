import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {NotificationsService} from "angular2-notifications";

@Injectable()
export class EsMedicoGuard implements CanActivate {

  constructor(
    private notif: NotificationsService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    if (sessionStorage.getItem("rol") == "medico"){
      return true;
    }
    this.notif.error("Error de acceso", "Sólo los médicos pueden acceder a esta página!");
    return false;
  }
}
