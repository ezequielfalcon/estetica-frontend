import { Injectable } from '@angular/core';

@Injectable()
export class UtilesService {

  public convertirFechaYmd(fechaYmd: string): string {
    const separador = fechaYmd.substr(4, 1);
    return fechaYmd.substr(8, 2) + separador + fechaYmd.substr(5, 2) + separador + fechaYmd.substr(0, 4);
  }

  public convertirFechaMdy(fechaYmd: string): string {
    const separador = fechaYmd.substr(4, 1);
    return fechaYmd.substr(8, 2) + separador + fechaYmd.substr(5, 2) + separador + fechaYmd.substr(0, 4);
  }

  constructor() { }

}
