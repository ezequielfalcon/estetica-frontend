/**
 * Created by eze on 25/01/17.
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class HttpAuthService {
  private urlPrefix: string;

  constructor(private http: Http) {
    this.http = http;
    this.urlPrefix = 'https://estetica-backend-testing.herokuapp.com/api';
  }


  static createAuthorizationHeader(headers: Headers) {
    headers.append('x-access-token', sessionStorage.getItem('token'))
  }

  get(url) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.get(this.urlPrefix + url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.post(this.urlPrefix + url, data, {
      headers: headers
    });
  }

  put(url, data) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.put(this.urlPrefix + url, data, {
      headers: headers
    });
  }

  del(url) {
    let headers = new Headers();
    HttpAuthService.createAuthorizationHeader(headers);
    return this.http.delete(this.urlPrefix + url, {
      headers: headers
    });
  }
}
