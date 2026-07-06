import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);

  const role = localStorage.getItem('role')?.toUpperCase();
  const allowedRoles = route.data?.['roles'] as string[];

  if(!role){
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles && allowedRoles.includes(role)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};