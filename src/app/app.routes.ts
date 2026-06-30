import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component')
        .then(m => m.HomeComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard-dueno/dashboard-dueno.component')
        .then(m => m.DashboardDuenoComponent)
  },

  {
    path: 'suscripcion',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DUENO'] },
    loadComponent: () =>
      import('./suscripcion/suscripcion.component')
        .then(m => m.SuscripcionComponent)
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];
