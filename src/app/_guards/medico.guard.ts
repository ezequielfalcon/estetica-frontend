import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable()
export class MedicoGuard implements CanActivate {

  constructor(
    private router: Router
  ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem("rol") == "medico"){
      this.router.navigate(['/medicos']);
      return false;
    }
    return true;
  }

}
