import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import {SimpleNotificationsModule, NotificationsService} from "angular2-notifications";

import { AppComponent } from './app.component';
import { LoginComponent, HomeComponent, PacientesComponent, ObrasSocialesComponent, NuevaObraSocialComponent, VerModificarObraSocial } from './_componentes/index';

import { AuthGuard } from './_guards/index';
import { MenuComponent } from './_directivas/menu/menu.component';
import { FilterByPipe } from './_servicios/filtros/filter.pipe';

import { LoginService, HttpAuthService, ConfirmService } from './_servicios/index';
import 'hammerjs';
import { routing } from './app.routing';
import {PacientesService, ObrasSocialesService} from "./_servicios/datos/index";
import {DialogoComponent} from "./_directivas/dialogo/dialogo.component";
import { NuevoPacienteComponent } from './_componentes/pacientes/nuevo-paciente/nuevo-paciente.component';
import { VerModificarPacienteComponent } from './_componentes/pacientes/ver-modificar-paciente/ver-modificar-paciente.component';
import {SpinnerComponent} from "./_directivas/spinner/spinner.component";
import {SpinnerService} from "./_servicios/spinner.service";
import {AdminGuard} from "./_guards/admin.guard";
import { MedicosComponent } from './_componentes/medicos/medicos.component';
import {MedicosService} from "./_servicios/datos/medicos.service";
import { NuevoMedicoComponent } from './_componentes/medicos/nuevo-medico/nuevo-medico.component';
import { VerModificarMedicoComponent } from './_componentes/medicos/ver-modificar-medico/ver-modificar-medico.component';
import { ConfiguracionComponent } from './_componentes/configuracion/configuracion.component';
import { UsuariosComponent } from './_componentes/usuarios/usuarios.component';
import { ConsultoriosComponent } from './_componentes/consultorios/consultorios.component';
import {ConsultoriosService} from "./_servicios/datos/consultorios.service";
import { NuevoConsultorioComponent } from './_componentes/consultorios/nuevo-consultorio/nuevo-consultorio.component';
import { VerModificarConsultorioComponent } from './_componentes/consultorios/ver-modificar-consultorio/ver-modificar-consultorio.component';
import { AgendaComponent } from './_componentes/agenda/agenda.component';
import {TurnosService} from "./_servicios/datos/turnos.service";
import {ColorPickerModule} from "angular2-color-picker";
import { NuevoTurnoComponent } from './_componentes/agenda/nuevo-turno/nuevo-turno.component';
import { DialogoPacientesComponent } from './_directivas/dialogo-pacientes/dialogo-pacientes.component';
import {DialogoPacientesService} from "./_servicios/dialogos/dialogo-pacientes.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PacientesComponent,
    MenuComponent,
    ObrasSocialesComponent,
    NuevaObraSocialComponent,
    VerModificarObraSocial,
    FilterByPipe,
    DialogoComponent,
    NuevoPacienteComponent,
    VerModificarPacienteComponent,
    SpinnerComponent,
    MedicosComponent,
    NuevoMedicoComponent,
    VerModificarMedicoComponent,
    ConfiguracionComponent,
    UsuariosComponent,
    ConsultoriosComponent,
    NuevoConsultorioComponent,
    VerModificarConsultorioComponent,
    AgendaComponent,
    NuevoTurnoComponent,
    DialogoPacientesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    routing,
    SimpleNotificationsModule,
    ColorPickerModule
  ],
  exports: [
    DialogoComponent,
    DialogoPacientesComponent
  ] ,
  providers: [
    LoginService,
    HttpAuthService,
    AuthGuard,
    PacientesService,
    ObrasSocialesService,
    ConfirmService,
    SpinnerService,
    AdminGuard,
    MedicosService,
    ConsultoriosService,
    NotificationsService,
    TurnosService,
    DialogoPacientesService
  ],
  entryComponents: [
    DialogoComponent,
    DialogoPacientesComponent
  ] ,
  bootstrap: [AppComponent]
})
export class AppModule { }
