import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { TeamList } from './components/team-list/team-list';
import { ProjectList } from './components/project-list/project-list';
import { authGuard } from './guards/auth.guard';
import { TaskList } from './components/task-list/task-list';
import { AllProjectsComponent } from './components/all-projects/all-projects';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'teams', component: TeamList },
      { path: 'projects/:team_id', component: ProjectList },
      { path: 'projects/:projectId/tasks', component: TaskList },
      { path: 'all-projects', component: AllProjectsComponent },
     
      { path: 'projects/:projectId/tasks/:taskId', component: TaskList }
    ]
  },

  { path: '**', redirectTo: 'login' }
];