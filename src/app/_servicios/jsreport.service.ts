import { Injectable } from '@angular/core';
import {ListadoTurnos} from '../_modelos/reportes/listado-turnos';
import {Http, Headers, Response, ResponseContentType} from '@angular/http';
import {ReporteJson} from '../_modelos/reportes/reporte-json';

@Injectable()
export class JsreportService {

  constructor(
    private http: Http
  ) { }

  generarListadoTurnos(listado: ListadoTurnos) {
    const listadoJson = JSON.stringify(listado);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic YWRtaW46djM0ZXZlcj8y');
    const reporteJson = new ReporteJson();
    reporteJson.template = {};
    reporteJson.data = {};
    reporteJson.template.name = 'listado-turnos';
    reporteJson.data = listadoJson;
    return this.http.post('https://estetica-backend.herokuapp.com/reportes/api/report', reporteJson,
      {headers: headers}).map((response: Response) => response);
  }

}
