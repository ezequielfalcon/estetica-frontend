import {Component, OnInit, OnDestroy} from '@angular/core';
import {ConsultoriosService} from "../../_servicios/datos/consultorios.service";
import {MedicosService} from "../../_servicios/datos/medicos.service";
import {Medico} from "../../_modelos/medico";
import {Consultorio} from "../../_modelos/consultorio";
import {SpinnerService} from "../../_servicios/spinner.service";
import {NotificationsService} from "angular2-notifications";
import {TurnosService} from "../../_servicios/datos/turnos.service";
import {Turno} from "../../_modelos/turno";

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnDestroy {

  constructor(
    private consultoriosService: ConsultoriosService,
    private medicosService: MedicosService,
    private spinner: SpinnerService,
    private notificationSerivce: NotificationsService,
    private turnosService: TurnosService
  ) { }

  medicos: Medico[] = [];
  consultorios: Consultorio[] = [];
  turnos: Turno[] = [];
  configuracion: any = {};
  estadoTurnos: string[][] = [""][""];

  ngOnInit() {
    for (let i:number = 0; i < 5; i++){
      for(let x:number = 0; x < 37; x++){
        this.estadoTurnos[i][x] = "Vacío";
      }
    }
    this.cargarConsuls();
    this.cargarMedicos();
    this.traerConfigTurnos();
    this.traerTurnos(AgendaComponent.fechaHoy());
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  traerConfigTurnos(){
    this.turnosService.traerConfig().subscribe(configDb => {
      this.configuracion = configDb;
      this.configuracion.fecha = this.configuracion.fecha.substr(0, 10);
      this.configuracion.fechaActual = AgendaComponent.fechaHoy();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  private static fechaHoy(){
    let fechaObject = new Date();
    let mesString = (fechaObject.getMonth() + 1) < 10 ? "0" + (fechaObject.getMonth() +1).toString() : (fechaObject.getMonth() + 1).toString();
    let diaString = fechaObject.getDate() < 10 ? "0" + fechaObject.getDate().toString() : fechaObject.getDate().toString();
    return fechaObject.getFullYear() + "-" + mesString + "-" + diaString;
  }

  cargarConsuls(){
    this.consultoriosService.getAll().subscribe(consulsDb => {
      this.consultorios = consulsDb;
      this.spinner.stop();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  cargarMedicos(){
    this.medicosService.getAll().subscribe(medicosDb => {
      this.medicos = medicosDb;
      this.spinner.stop();
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  llenarMatrizTurnos(turnosDbObjeto: Turno[]){
    for (let turnoDb of turnosDbObjeto){
      let medicoTurnoDb = turnoDb.id_medico;
      let medicoTurnoObject: Medico;
      for (let medicosDb of this.medicos){
        if (medicosDb.id == medicoTurnoDb){
          medicoTurnoObject = medicosDb;
        }
      }

      //this.estadoTurnos[turnoDb.id_consultorio][turnoDb.id_turno] =
    }
  }

  celdaTurno(consultorioId, turnoId: number){
    for (let turno of this.turnos){
      if (turno.id_turno == turnoId && turno.id_consultorio == consultorioId){
        for (let medico of this.medicos){
          if (medico.id == turno.id_medico){
            return medico.apellido;
          }
        }
      }
    }
    return "Vacío";
  }

  traerTurnos(fecha: string){
    this.turnosService.traerTurnos(fecha).subscribe(turnosDb => {
      this.turnos = turnosDb;
    }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationSerivce.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

}
