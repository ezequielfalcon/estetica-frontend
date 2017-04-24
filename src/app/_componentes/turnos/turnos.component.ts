import {Component, OnInit, OnDestroy} from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {SpinnerService} from "../../_servicios/spinner.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {Medico} from "../../_modelos/medico";
import {TurnosService} from "../../_servicios/datos/turnos.service";
import {Router} from "@angular/router";
import {TurnoResumenMedico} from "../../_modelos/turno-resumen-medico";
import {Horario} from '../../_modelos/horario';
import {Consultorio} from '../../_modelos/consultorio';
import {ConsultoriosService} from '../../_servicios/datos/consultorios.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit, OnDestroy {

  constructor(
    private notificationService: NotificationsService,
    private spinner: SpinnerService,
    private medicosService: MedicosService,
    private turnosService: TurnosService,
    private consultoriosService: ConsultoriosService,
    private router: Router
  ) { this.fechaTurnos = TurnosComponent.fechaHoy() }

  medicos: Medico[] = [];
  medicoSeleccionado: number;
  turnosMedico: TurnoResumenMedico[] = [];
  horarios: Horario[] = [];
  consultorios: Consultorio[] = [];
  fechaTurnos: string;

  ngOnInit() {
    this.cargarMedicos();
    this.cargarHorarios();
    this.cargarConsultorios();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  cambiarFecha(){
    this.spinner.start();
    this.cargarTurnos(this.medicoSeleccionado, this.fechaTurnos);
  }

  cargarHorarios() {
    this.turnosService.verHorarios().subscribe(horariosDb => {
      this.horarios = horariosDb;
      this.spinner.stop();
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarConsultorios() {
    this.consultoriosService.getAll().subscribe(consultoriosDb => {
      this.consultorios = consultoriosDb;
    }, error => {
      if (error.status === 401) {
        this.notificationService.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
    });
  }

  medicoSeleccionadoList(medicoId: number){
    this.spinner.start();
    this.cargarTurnos(medicoId, this.fechaTurnos);
  }

  cargarTurnos(medicoId: number, fecha: string){
    this.turnosService.traerTurnosPorMedico(medicoId, fecha).subscribe(turnosDb => {
      this.turnosMedico = turnosDb;
      this.spinner.stop();
    }, error => {
      if (error.status == 401){
        this.notificationService.error("Error","Sesión expirada!");
        this.router.navigate(['/login']);
      }
      let body = JSON.parse(error._body);
      this.notificationService.error('Error', body.mensaje);
      this.spinner.stop();
    });
  }

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

  convertirHora(horarioId: number) {
    for (const horario of this.horarios) {
      if (horario.id === horarioId) {
        return horario.hora;
      }
    }
    return 'error';
  }

  convertirConsultorio(consultorioId: number){
    for (const consultorio of this.consultorios)
      if (consultorio.id === consultorioId){
      return consultorio.nombre;
      }
      return 'error';
  }

}
