/**
 * Created by eze on 15/04/17.
 */
export class TurnoMedico {
  id: number;
  paciente: string;
  id_consultorio: number;
  id_turno: number;
  entreturno: boolean;
  presente: boolean;
  atendido: boolean;
  hora_llegada: string;
}
