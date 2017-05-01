/**
 * Created by eze on 06/03/17.
 */
export class TurnoResumenMedico {
  id: number;
  paciente: string;
  telefono: string;
  id_consultorio: number;
  id_turno: number;
  entreturno: boolean;
  atendido: boolean;
  hora_llegada: string;
  costo: string;
  tratamientos: string;
}
