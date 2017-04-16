import { Pipe, PipeTransform } from '@angular/core';
import {TurnoMedico} from "../../_modelos/turno-medico";

@Pipe({
  name: 'turnosAtendidos'
})
export class TurnosAtendidosPipe implements PipeTransform {

  transform(array: any[], filter: TurnoMedico): any {
    return array.filter(this.filtrar(filter));
  }

  filtrar(turno: TurnoMedico){
    return filtrado => {
      return !turno || turno.atendido;
    }
  }

}
