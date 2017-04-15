/**
 * Created by eze on 25/01/17.
 */
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';

import { LoginComponent, HomeComponent, PacientesComponent, NuevaObraSocialComponent, VerModificarObraSocial } from './_componentes/index';
import {NuevoPacienteComponent} from "./_componentes/pacientes/nuevo-paciente/nuevo-paciente.component";
import {VerModificarPacienteComponent} from "./_componentes/pacientes/ver-modificar-paciente/ver-modificar-paciente.component";
import {AdminGuard} from "./_guards/admin.guard";
import {NuevoMedicoComponent} from "./_componentes/configuracion/medicos/nuevo-medico/nuevo-medico.component";
import {VerModificarMedicoComponent} from "./_componentes/configuracion/medicos/ver-modificar-medico/ver-modificar-medico.component";
import {ConfiguracionComponent} from "./_componentes/configuracion/configuracion.component";
import {AgendaComponent} from "./_componentes/agenda/agenda.component";
import {NuevoTurnoComponent} from "./_componentes/agenda/nuevo-turno/nuevo-turno.component";
import {NuevoTratamientoComponent} from "./_componentes/configuracion/tratamientos/nuevo-tratamiento/nuevo-tratamiento.component";
import {VerModificarTratamientoComponent} from "./_componentes/configuracion/tratamientos/ver-modificar-tratamiento/ver-modificar-tratamiento.component";
import {RedirAgendaComponent} from "./_componentes/agenda/redir-agenda/redir-agenda.component";
import {NuevoUsuarioComponent} from "./_componentes/configuracion/usuarios/nuevo-usuario/nuevo-usuario.component";
import {TurnosComponent} from "./_componentes/turnos/turnos.component";
import {LiquidacionesComponent} from "./_componentes/liquidaciones/liquidaciones.component";
import {MedicoHomeComponent} from "./_componentes/medico-home/medico-home.component";
import {MedicoGuard} from "./_guards/medico.guard";
import {EsMedicoGuard} from "./_guards/es-medico.guard";
import {CuentaCorrienteComponent} from "./_componentes/cuenta-corriente/cuenta-corriente.component";

const appRoutes: Routes = [
  { path: '', component: TurnosComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'agenda/:fecha', component: AgendaComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'redir-agenda/:fecha', component: RedirAgendaComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard, MedicoGuard]},
  { path: 'pacientes/:id', component: VerModificarPacienteComponent, canActivate: [AuthGuard, MedicoGuard] } ,
  { path: 'medicos/:id', component: VerModificarMedicoComponent, canActivate: [AuthGuard, AdminGuard] } ,
  { path: 'obras-sociales/:id', component: VerModificarObraSocial, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nueva-obra-social', component: NuevaObraSocialComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-paciente', component: NuevoPacienteComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'nuevo-medico', component: NuevoMedicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'configuracion/:id', component: ConfiguracionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-usuario', component: NuevoUsuarioComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-turno/:consultorio/:turno/:fecha/:entreturno', component: NuevoTurnoComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'nuevo-tratamiento', component: NuevoTratamientoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tratamientos/:id', component: VerModificarTratamientoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'liquidaciones', component: LiquidacionesComponent, canActivate: [AuthGuard, MedicoGuard] },
  { path: 'medicos', component: MedicoHomeComponent, canActivate:[AuthGuard, EsMedicoGuard] },
  { path: 'cuenta-corriente', component: CuentaCorrienteComponent, canActivate: [AuthGuard, MedicoGuard] },

  { path: '*', redirectTo: '/agenda' }
];

export const routing = RouterModule.forRoot(appRoutes);
