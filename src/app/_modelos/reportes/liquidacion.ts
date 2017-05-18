/**
 * Created by falco on 18/5/2017.
 */
import {TurnoReporte} from './turno-reporte';
/**
 * Created by falco on 18/5/2017.
 */
export class ListadoTurno {
  medico: string;
  fecha: string;
  subtotal: number;
  descuentos: number;
  total: number;
  turnos: Array<TurnoReporte>;
}
