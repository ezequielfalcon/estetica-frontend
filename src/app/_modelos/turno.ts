/**
 * Created by eze on 11/02/17.
 */
export class Turno {
  id: number;
  observaciones: string;
  costo: string;
  id_medico: number;
  id_paciente: number;
  id_consultorio: number;
  usuario: string;
  id_turno: number;
  fecha: string;
  entreturno: boolean;
  presente: boolean;
  atendido: boolean;
  hora_llegada: string;
}
