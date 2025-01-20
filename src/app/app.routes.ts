import { Routes } from '@angular/router';
import { HomeComponent } from './paginas/home/home.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';
import { ProfesoresComponent } from './paginas/profesores/profesores.component';
import { EstudianteComponent } from './paginas/estudiante/estudiante.component';
import { CursosComponent } from './paginas/cursos/cursos.component';
import { NotasComponent } from './paginas/notas/notas.component';
import { ErrorComponent } from './paginas/error/error.component';
import { LoginComponent } from './paginas/login/login.component';
import { RoleGuard } from './guards/auth.guard';
import { EditPrefesorComponent } from './paginas/profesores/edit-prefesor/edit-prefesor.component';

export const routes: Routes = [

   // Ruta raíz: Redirige a /login si no está autenticado
   { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  {
    path: "usuario",
    component: UsuariosComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'DEVELOPER'] } // Permitir a ADMIN y DEVELOPER
  },
  {
    path: "profesor",
    component: ProfesoresComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEACHER', 'DEVELOPER','INVITED'] } // Permitir a ADMIN, TEACHER, DEVELOPER
  },
  {
    path: 'editar-profesor/:id',
    component: EditPrefesorComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEACHER', 'DEVELOPER', 'INVITED'] } // Permitir a ADMIN, TEACHER, DEVELOPER
  },


  {
    path: "estudiante",
    component: EstudianteComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'STUDENT', 'DEVELOPER'] } // Permitir a ADMIN, STUDENT, DEVELOPER
  },
  {
    path: "curso",
    component: CursosComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'DEVELOPER'] } // Permitir a ADMIN, TEACHER, DEVELOPER
  },
  {
    path: "nota",
    component: NotasComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEACHER', 'DEVELOPER','ADMIN'] } // Permitir a TEACHER, DEVELOPER
  },
  { path: "login", component: LoginComponent },
  { path: "**", component: ErrorComponent },
];
