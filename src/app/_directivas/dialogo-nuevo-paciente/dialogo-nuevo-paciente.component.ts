import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ObraSocial} from '../../_modelos/obra_social';
import {Router} from '@angular/router';
import {ObrasSocialesService} from '../../_servicios/datos/obras-sociales.service';
import {NotificationsService} from 'angular2-notifications';
import {PacientesService} from '../../_servicios/datos/pacientes.service';
import {MdDialogRef} from '@angular/material';
import {DialogoObrasSocialesService} from '../../_servicios/dialogos/dialogo-obras-sociales.service';
import {DialogoNuevaObraSocialService} from '../../_servicios/dialogos/dialogo-nueva-obra-social.service';

@Component({
  selector: 'app-dialogo-nuevo-paciente',
  templateUrl: './dialogo-nuevo-paciente.component.html',
  styleUrls: ['./dialogo-nuevo-paciente.component.css']
})
export class DialogoNuevoPacienteComponent implements OnInit {

  osSeleccionada: ObraSocial;
  nuevoPac: any = {};
  sexos = [
    {valor: 'M', nombre: 'Masculino'},
    {valor: 'F', nombre: 'Femenino'},
    {valor: 'N', nombre: 'N/A'}
  ];

  constructor(
    private pacientesService: PacientesService,
    private notif: NotificationsService,
    private osService: ObrasSocialesService,
    private osDialog: DialogoObrasSocialesService,
    private nuevaOsDialog: DialogoNuevaObraSocialService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    public dialogRef: MdDialogRef<DialogoNuevoPacienteComponent>
  ) { }

  ngOnInit() {
  }

  seleccionarOs() {
    this.osDialog.seleccionarOs(this.viewContainerRef).subscribe(osSeleccionadaDialogo => {
      if (osSeleccionadaDialogo) {
        if (osSeleccionadaDialogo === -1) {
          this.nuevaOsDialog.crearOs(this.viewContainerRef).subscribe(nuevaOsDialogo => {
            if (nuevaOsDialogo) {
              this.cargarOs(nuevaOsDialogo);
            }
          });
        } else {
          this.cargarOs(osSeleccionadaDialogo);
        }
      }
    });
  }

  cargarOs(idOs: number) {
    this.osService.get(idOs).subscribe( osDb => {
      this.osSeleccionada = osDb;
    }, error => {
      if (error.status === 401) {
        this.notif.error('Error', 'Sesión expirada!');
        this.router.navigate(['/login']);
      }
      const body = JSON.parse(error._body);
      this.notif.error('Error', body.mensaje);
    });
  }

  crear() {
    let capNombre = DialogoNuevoPacienteComponent.capitalize(this.nuevoPac.nombre);
    let capApellido = DialogoNuevoPacienteComponent.capitalize(this.nuevoPac.apellido);
    this.pacientesService.post(capNombre, capApellido,
      this.nuevoPac.documento, this.nuevoPac.tel || ' ', this.nuevoPac.email || ' ',
      this.nuevoPac.fechaNac || '1901-01-01', this.nuevoPac.sexo || 'N', this.nuevoPac.id_os || 7886,
      this.nuevoPac.numero_os || ' ', this.nuevoPac.domicilio || ' ', this.nuevoPac.obvservaciones || ' ', this.nuevoPac.celular || ' ')
      .subscribe(nuevoP => {
        this.notif.success('OK', 'Paciente creado con ID ' + nuevoP.id);
        this.dialogRef.close(nuevoP.id);
      }, error => {
        if (error.status === 401) {
          this.notif.error('Error', 'Sesión expirada!');
          this.router.navigate(['/login']);
        }
        const body = JSON.parse(error._body);
        this.notif.error('Error', body.mensaje);
      });
  }

  static capitalize(texto: string)
  {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

}
