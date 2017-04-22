import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule, MdDialogModule, MdGridListModule,
  MdIconModule,
  MdInputModule, MdLineModule, MdListModule, MdMenuModule, MdProgressBarModule, MdSelectModule, MdSidenavModule,
  MdSliderModule, MdTabsModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {SimpleNotificationsModule, NotificationsService} from 'angular2-notifications';

import { AppComponent } from './app.component';
import { LoginComponent, HomeComponent, PacientesComponent, ObrasSocialesComponent,
  NuevaObraSocialComponent, VerModificarObraSocial } from './_componentes/index';

import { AuthGuard } from './_guards/index';
import { MenuComponent } from './_directivas/menu/menu.component';
import { FilterByPipe } from './_servicios/filtros/filter.pipe';

import { LoginService, HttpAuthService, ConfirmService } from './_servicios/index';
import 'hammerjs';
import { routing } from './app.routing';
import {PacientesService, ObrasSocialesService} from './_servicios/datos/index';
import {DialogoComponent} from './_directivas/dialogo/dialogo.component';
import { NuevoPacienteComponent } from './_componentes/pacientes/nuevo-paciente/nuevo-paciente.component';
import { VerModificarPacienteComponent } from './_componentes/pacientes/ver-modificar-paciente/ver-modificar-paciente.component';
import {SpinnerComponent} from './_directivas/spinner/spinner.component';
import {SpinnerService} from './_servicios/spinner.service';
import {AdminGuard} from './_guards/admin.guard';
import { MedicosComponent } from './_componentes/configuracion/medicos/medicos.component';
import {MedicosService} from './_servicios/datos/medicos.service';
import { NuevoMedicoComponent } from './_componentes/configuracion/medicos/nuevo-medico/nuevo-medico.component';
import { VerModificarMedicoComponent } from './_componentes/configuracion/medicos/ver-modificar-medico/ver-modificar-medico.component';
import { ConfiguracionComponent } from './_componentes/configuracion/configuracion.component';
import { UsuariosComponent } from './_componentes/configuracion/usuarios/usuarios.component';
import {ConsultoriosService} from './_servicios/datos/consultorios.service';
import { AgendaComponent } from './_componentes/agenda/agenda.component';
import {TurnosService} from './_servicios/datos/turnos.service';
import { NuevoTurnoComponent } from './_componentes/agenda/nuevo-turno/nuevo-turno.component';
import { DialogoPacientesComponent } from './_directivas/dialogo-pacientes/dialogo-pacientes.component';
import {DialogoPacientesService} from './_servicios/dialogos/dialogo-pacientes.service';
import { DialogoMedicosComponent } from './_directivas/dialogo-medicos/dialogo-medicos.component';
import {DialogoMedicosService} from './_servicios/dialogos/dialogo-medicos.service';
import { TratamientosComponent } from './_componentes/configuracion/tratamientos/tratamientos.component';
import {NuevoTratamientoComponent} from './_componentes/configuracion/tratamientos/nuevo-tratamiento/nuevo-tratamiento.component';
import {TratamientosService} from './_servicios/datos/tratamientos.service';
import { VerModificarTratamientoComponent } from './_componentes/configuracion/tratamientos/ver-modificar-tratamiento/ver-modificar-tratamiento.component';
import { DialogoTratamientosComponent } from './_directivas/dialogo-tratamientos/dialogo-tratamientos.component';
import {DialogoTratamientosService} from './_servicios/dialogos/dialogo-tratamientos.service';
import { DialogoTurnoComponent } from './_directivas/dialogo-turno/dialogo-turno.component';
import {DialogoTurnoService} from './_servicios/dialogos/dialogo-turno.service';
import { RedirAgendaComponent } from './_componentes/agenda/redir-agenda/redir-agenda.component';
import {UsuariosService} from './_servicios/datos/usuarios.service';
import { NuevoUsuarioComponent } from './_componentes/configuracion/usuarios/nuevo-usuario/nuevo-usuario.component';
import { TurnosComponent } from './_componentes/turnos/turnos.component';
import { LiquidacionesComponent } from './_componentes/liquidaciones/liquidaciones.component';
import { MedicoHomeComponent } from './_componentes/medico-home/medico-home.component';
import {MedicoGuard} from './_guards/medico.guard';
import {EsMedicoGuard} from './_guards/es-medico.guard';
import { CuentaCorrienteComponent } from './_componentes/cuenta-corriente/cuenta-corriente.component';
import {CuentaCorrienteService} from './_servicios/datos/cuenta-corriente.service';
import { DialogoCtacteComponent } from './_directivas/dialogo-ctacte/dialogo-ctacte.component';
import {DialogoCtacteService} from './_servicios/dialogos/dialogo-ctacte.service';
import {SubsistemaMedicosService} from './_servicios/datos/subsistema-medicos.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TurnosPresentesPipe } from './_servicios/filtros/turnos-presentes.pipe';
import { TurnosAtendidosPipe } from './_servicios/filtros/turnos-atendidos.pipe';
import {DarkThemeService} from './_servicios/dark-theme.service';
import { DialogoNuevoPacienteComponent } from './_directivas/dialogo-nuevo-paciente/dialogo-nuevo-paciente.component';
import {DialogoNuevoPacienteService} from './_servicios/dialogos/dialogo-nuevo-paciente.service';
import { DialogoObrasSocialesComponent } from './_directivas/dialogo-obras-sociales/dialogo-obras-sociales.component';
import {DialogoObrasSocialesService} from './_servicios/dialogos/dialogo-obras-sociales.service';
import { DialogoNuevaObraSocialComponent } from './_directivas/dialogo-nueva-obra-social/dialogo-nueva-obra-social.component';
import {DialogoNuevaObraSocialService} from "./_servicios/dialogos/dialogo-nueva-obra-social.service";
import { DialogoAnulacionesComponent } from './_directivas/dialogo-anulaciones/dialogo-anulaciones.component';
import {DialogoAnulacionesService} from "./_servicios/dialogos/dialogo-anulaciones.service";
import { DialogoNuevaAnulacionComponent } from './_directivas/dialogo-nueva-anulacion/dialogo-nueva-anulacion.component';

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
    NuevoTratamientoComponent,
    VerModificarTratamientoComponent,
    DialogoTratamientosComponent,
    DialogoTurnoComponent,
    RedirAgendaComponent,
    NuevoUsuarioComponent,
    TurnosComponent,
    LiquidacionesComponent,
    MedicoHomeComponent,
    CuentaCorrienteComponent,
    DialogoCtacteComponent,
    TurnosPresentesPipe,
    TurnosAtendidosPipe,
    DialogoNuevoPacienteComponent,
    DialogoObrasSocialesComponent,
    DialogoNuevaObraSocialComponent,
    DialogoAnulacionesComponent,
    DialogoNuevaAnulacionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    SimpleNotificationsModule,
    BrowserAnimationsModule,
    MdInputModule,
    MdCardModule,
    MdButtonModule,
    MdSliderModule,
    MdInputModule,
    MdCoreModule,
    MdDialogModule,
    MdCheckboxModule,
    MdChipsModule,
    MdIconModule,
    MdListModule,
    MdLineModule,
    MdMenuModule,
    MdTabsModule,
    MdToolbarModule,
    MdSelectModule,
    MdProgressBarModule,
    MdGridListModule,
    MdSidenavModule,
    MdTooltipModule
  ],
  exports: [
    DialogoComponent,
    DialogoPacientesComponent,
    DialogoMedicosComponent,
    DialogoTratamientosComponent,
    DialogoCtacteComponent,
    DialogoNuevoPacienteComponent,
    DialogoObrasSocialesComponent,
    DialogoNuevaObraSocialComponent,
    DialogoAnulacionesComponent
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
    TratamientosService,
    DialogoTratamientosService,
    DialogoTurnoService,
    UsuariosService,
    MedicoGuard,
    EsMedicoGuard,
    CuentaCorrienteService,
    DialogoCtacteService,
    SubsistemaMedicosService,
    DarkThemeService,
    DialogoNuevoPacienteService,
    DialogoObrasSocialesService,
    DialogoNuevaObraSocialService,
    DialogoAnulacionesService
  ],
  entryComponents: [
    DialogoComponent,
    DialogoPacientesComponent,
    DialogoMedicosComponent,
    DialogoTratamientosComponent,
    DialogoTurnoComponent,
    DialogoCtacteComponent,
    DialogoNuevoPacienteComponent,
    DialogoObrasSocialesComponent,
    DialogoNuevaObraSocialComponent,
    DialogoAnulacionesComponent
  ] ,
  bootstrap: [AppComponent]
})
export class AppModule { }
