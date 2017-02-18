import {Component, OnInit, OnDestroy} from '@angular/core';
import {SpinnerService} from "../../_servicios/spinner.service";
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications";
import {Consultorio} from "../../_modelos/consultorio";
import {ConsultoriosService} from "../../_servicios/datos/consultorios.service";

@Component({
  selector: 'app-consultorios',
  templateUrl: './consultorios.component.html',
  styleUrls: ['./consultorios.component.css']
})
export class ConsultoriosComponent implements OnInit, OnDestroy {

  constructor(
    private notificationService: NotificationsService,
    private consultoriosService: ConsultoriosService,
    private router: Router,
    private spinner: SpinnerService
  ) { }

  consultorios: Consultorio[] = [];

  ngOnInit() {
    this.cargarConsultorios();
  }

  ngOnDestroy(){
    this.spinner.start();
  }

  private cargarConsultorios(){
    this.consultoriosService.getAll().subscribe(consultoriosDb => { this.consultorios = consultoriosDb; this.spinner.stop() }, error => {
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      let mensajeError = JSON.parse(err);
      this.notificationService.error('Error', mensajeError.mensaje);
      this.spinner.stop();
    });
  }

  private detalles(id: number){
    this.router.navigate(['/consultorios/' + id]);
  }

}
