/**
 * Created by eze on 25/01/17.
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications";

@Injectable()
export class HttpAuthService {
  private urlPrefix: string;

  constructor(
    private http: Http,
    private router: Router,
    private notif: NotificationsService
  ) {
    this.http = http;
    this.urlPrefix = 'https://estetica-backend.herokuapp.com/api';
  }


  static createAuthorizationHeader(headers: Headers) {
    headers.append('x-access-token', localStorage.getItem('token'));
  }

  get(url) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.get(this.urlPrefix + url, {
      headers: headers
    }).catch(error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      return error;
    });
  }

  post(url, data) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.post(this.urlPrefix + url, data, {
      headers: headers
    }).catch(error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      return error;
    });
  }

  put(url, data) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.put(this.urlPrefix + url, data, {
      headers: headers
    }).catch(error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      return error;
    });
  }

  del(url) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.delete(this.urlPrefix + url, {
      headers: headers
    }).catch(error => {
      if (error.status == 401){
        this.notif.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      return error;
    });
  }
}
