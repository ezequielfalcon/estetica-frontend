import { Injectable } from '@angular/core';
import {ListadoTurnos} from '../_modelos/reportes/listado-turnos';
import {Http, Headers, Response, ResponseContentType} from '@angular/http';
import {ReporteJson} from '../_modelos/reportes/reporte-json';
import {SpinnerService} from './spinner.service';
import {Liquidacion} from '../_modelos/reportes/liquidacion';

@Injectable()
export class JsreportService {

  constructor(
    private http: Http,
    private spinner: SpinnerService
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
    this.http.post('https://estetica-backend.herokuapp.com/reportes/api/report', reporteJson,
      {headers: headers, responseType: ResponseContentType.Blob}).map((response: Response) => response).subscribe(reporte => {
      const downloadLink      = document.createElement('a');
      downloadLink.target   = '_blank';
      downloadLink.download = 'Listado de Turnos - ' + listado.medico + ' - ' + listado.fecha + '.pdf';
      const blob = new Blob([reporte.blob()], { type: 'application/pdf' });
      const URL = window.URL;
      const downloadUrl = URL.createObjectURL(blob);
      downloadLink.href = downloadUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
      this.spinner.stop();
    });
  }

  generarLiquidacion(liquidacion: Liquidacion) {
    const liquidacionJson = JSON.stringify(liquidacion);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic YWRtaW46djM0ZXZlcj8y');
    const reporteJson = new ReporteJson();
    reporteJson.template = {};
    reporteJson.data = {};
    reporteJson.template.name = 'liquidacion';
    reporteJson.data = liquidacionJson;
    this.http.post('https://estetica-backend.herokuapp.com/reportes/api/report', reporteJson,
      {headers: headers, responseType: ResponseContentType.Blob}).map((response: Response) => response).subscribe(reporte => {
      const downloadLink      = document.createElement('a');
      downloadLink.target   = '_blank';
      downloadLink.download = 'Liquidacion - ' + liquidacion.medico + ' - ' + liquidacion.fecha + '.pdf';
      const blob = new Blob([reporte.blob()], { type: 'application/pdf' });
      const URL = window.URL;
      const downloadUrl = URL.createObjectURL(blob);
      downloadLink.href = downloadUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
      this.spinner.stop();
    });
  }

}
