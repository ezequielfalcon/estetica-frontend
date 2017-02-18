/**
 * Created by eze on 25/01/17.
 */
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/index';

import { LoginComponent, HomeComponent, PacientesComponent, NuevaObraSocialComponent, VerModificarObraSocial } from './_componentes/index';
import {NuevoPacienteComponent} from "./_componentes/pacientes/nuevo-paciente/nuevo-paciente.component";
import {VerModificarPacienteComponent} from "./_componentes/pacientes/ver-modificar-paciente/ver-modificar-paciente.component";
import {AdminGuard} from "./_guards/admin.guard";
import {NuevoMedicoComponent} from "./_componentes/medicos/nuevo-medico/nuevo-medico.component";
import {VerModificarMedicoComponent} from "./_componentes/medicos/ver-modificar-medico/ver-modificar-medico.component";
import {ConfiguracionComponent} from "./_componentes/configuracion/configuracion.component";
import {NuevoConsultorioComponent} from "./_componentes/consultorios/nuevo-consultorio/nuevo-consultorio.component";
import {VerModificarConsultorioComponent} from "./_componentes/consultorios/ver-modificar-consultorio/ver-modificar-consultorio.component";
import {AgendaComponent} from "./_componentes/agenda/agenda.component";

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard]},
  { path: 'pacientes/:id', component: VerModificarPacienteComponent, canActivate: [AuthGuard] } ,
  { path: 'medicos/:id', component: VerModificarMedicoComponent, canActivate: [AuthGuard, AdminGuard] } ,
  { path: 'obras-sociales/:id', component: VerModificarObraSocial, canActivate: [AuthGuard, AdminGuard] },
  { path: 'consultorios/:id', component: VerModificarConsultorioComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nueva-obra-social', component: NuevaObraSocialComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-paciente', component: NuevoPacienteComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-medico', component: NuevoMedicoComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'nuevo-consultorio', component: NuevoConsultorioComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'configuracion/:id', component: ConfiguracionComponent, canActivate: [AuthGuard, AdminGuard] },

  { path: '*', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
