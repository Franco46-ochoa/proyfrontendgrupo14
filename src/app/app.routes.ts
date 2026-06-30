import { Routes } from '@angular/router';

import {authGuard} from './core/guards/auth.guard';
import {roleGuard} from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login.component').then((m) => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./auth/register/register.component').then((m) => m.RegisterComponent)
    },
    {
        path: 'suscripcion',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['DUENO']
        },
        loadComponent: () =>
            import('./suscripcion/suscripcion.component').then(m=> m.SuscripcionComponent)
    },
    {
        path: 'datatable',
        canActivate: [authGuard, roleGuard],
        data: {
            roles: ['DUENO']
        },
        loadComponent: () =>
            import('./shared/components/datatable/datatable.component').then(m=> m.DatatableComponent)

    },
    {
        path: '**',
        redirectTo: 'login'
    }

];
