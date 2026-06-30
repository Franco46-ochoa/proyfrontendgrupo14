import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {

  const role = localStorage.getItem('role');

  const allowedRoles = route.data?.['roles'];

  return allowedRoles?.includes(role);
};