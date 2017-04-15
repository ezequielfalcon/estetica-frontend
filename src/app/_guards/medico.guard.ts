import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {NotificationsService} from "angular2-notifications/dist";

@Injectable()
export class MedicoGuard implements CanActivate {

  constructor(
    private router: Router,
    private notif: NotificationsService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem("rol") == "medico"){
      this.router.navigate(['/medicos']);
      return false;
    }
    return true;
  }

}
