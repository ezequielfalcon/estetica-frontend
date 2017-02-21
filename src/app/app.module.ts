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
import {ConsultoriosService} from "./_servicios/datos/consultorios.service";
import { AgendaComponent } from './_componentes/agenda/agenda.component';
import {TurnosService} from "./_servicios/datos/turnos.service";
import { NuevoTurnoComponent } from './_componentes/agenda/nuevo-turno/nuevo-turno.component';
import { DialogoPacientesComponent } from './_directivas/dialogo-pacientes/dialogo-pacientes.component';
import {DialogoPacientesService} from "./_servicios/dialogos/dialogo-pacientes.service";
import { DialogoMedicosComponent } from './_directivas/dialogo-medicos/dialogo-medicos.component';
import {DialogoMedicosService} from "./_servicios/dialogos/dialogo-medicos.service";
import {ColorPickerModule} from "ng2-color-picker";
import { TratamientosComponent } from './_componentes/tratamientos/tratamientos.component';
import {NuevoTratamientoComponent} from "./_componentes/tratamientos/nuevo-tratamiento/nuevo-tratamiento.component";
import {TratamientosService} from "./_servicios/datos/tratamientos.service";

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
    AgendaComponent,
    NuevoTurnoComponent,
    DialogoPacientesComponent,
    DialogoMedicosComponent,
    TratamientosComponent,
    NuevoTratamientoComponent
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
    DialogoPacientesComponent,
    DialogoMedicosComponent
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
    DialogoPacientesService,
    DialogoMedicosService,
    TratamientosService
  ],
  entryComponents: [
    DialogoComponent,
    DialogoPacientesComponent,
    DialogoMedicosComponent
  ] ,
  bootstrap: [AppComponent]
})
export class AppModule { }
