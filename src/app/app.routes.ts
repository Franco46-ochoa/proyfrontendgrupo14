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
    path: 'dashboard-gerente',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard-gerente/dashboard-gerente.component')
        .then(m => m.DashboardGerenteComponent)
  },

  {
    path: 'sucursales',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./sucursales/sucursal-list/sucursal-list')
        .then(m => m.SucursalList)
  },
  {
    path: 'sucursales/nueva',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./sucursales/sucursal-form/sucursal-form')
        .then(m => m.SucursalForm)
  },
  {
    path: 'sucursales/editar/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./sucursales/sucursal-form/sucursal-form')
        .then(m => m.SucursalForm)
  },
  {
    path: 'sucursales/mapa',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./sucursales/sucursal-mapa/sucursal-mapa.component')
        .then(m => m.SucursalMapaComponent)
  },

  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./inventario/producto-list/producto-list.component')
        .then(m => m.ProductoListComponent)
  },
  {
    path: 'productos/nuevo',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./inventario/producto-form/producto-form.component')
        .then(m => m.ProductoFormComponent)
  },
  {
    path: 'productos/editar/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./inventario/producto-form/producto-form.component')
        .then(m => m.ProductoFormComponent)
  },

  {
    path: 'inventario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./inventario/stock-sucursal/stock-sucursal.component')
        .then(m => m.StockSucursalComponent)
  },

  {
    path: 'transacciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./transacciones/transaccion-list/transaccion-list.component')
        .then(m => m.TransaccionListComponent)
  },
  {
    path: 'transacciones/nueva',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./transacciones/transaccion-form/transaccion-form.component')
        .then(m => m.TransaccionFormComponent)
  },
  {
    path: 'transacciones/editar/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./transacciones/transaccion-form/transaccion-form.component')
        .then(m => m.TransaccionFormComponent)
  },

  {
    path: 'gastos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./gastos/gasto-list/gasto-list.component')
        .then(m => m.GastoListComponent)
  },
  {
    path: 'gastos/nuevo',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./gastos/gasto-form/gasto-form.component')
        .then(m => m.GastoFormComponent)
  },
  {
    path: 'gastos/editar/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['GERENTE'] },
    loadComponent: () =>
      import('./gastos/gasto-form/gasto-form.component')
        .then(m => m.GastoFormComponent)
  },

  {
    path: 'proveedores',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./proveedores/proveedor-list/proveedor-list.component')
        .then(m => m.ProveedorListComponent)
  },
  {
    path: 'proveedores/nuevo',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DUENO', 'GERENTE'] },
    loadComponent: () =>
      import('./proveedores/proveedor-form/proveedor-form.component')
        .then(m => m.ProveedorFormComponent)
  },
  {
    path: 'proveedores/editar/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DUENO', 'GERENTE'] },
    loadComponent: () =>
      import('./proveedores/proveedor-form/proveedor-form.component')
        .then(m => m.ProveedorFormComponent)
  },

  {
    path: 'auditoria',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DUENO'] },
    loadComponent: () =>
      import('./auditoria/auditoria-list/auditoria-list.component')
        .then(m => m.AuditoriaListComponent)
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
    path: 'codigos',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DUENO'] },
    loadComponent: () =>
      import('./codigos/codigos.component')
        .then(m => m.CodigosComponent)
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];
