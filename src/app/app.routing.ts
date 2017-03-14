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

const appRoutes: Routes = [
  { path: '', component: TurnosComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: 'agenda/:fecha', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: 'redir-agenda/:fecha', component: RedirAgendaComponent, canActivate: [AuthGuard] },
  { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard]},
  { path: 'pacientes/:id', component: VerModificarPacienteComponent, canActivate: [AuthGuard] } ,
  { path: 'medicos/:id', component: VerModificarMedicoComponent, canActivate: [AuthGuard, AdminGuard] } ,
  { path: 'obras-sociales/:id', component: VerModificarObraSocial, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nueva-obra-social', component: NuevaObraSocialComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-paciente', component: NuevoPacienteComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-medico', component: NuevoMedicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'configuracion/:id', component: ConfiguracionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-usuario', component: NuevoUsuarioComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-turno/:consultorio/:turno/:fecha/:entreturno', component: NuevoTurnoComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-tratamiento', component: NuevoTratamientoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'tratamientos/:id', component: VerModificarTratamientoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'liquidaciones', component: LiquidacionesComponent, canActivate: [AuthGuard] },

  { path: '*', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
