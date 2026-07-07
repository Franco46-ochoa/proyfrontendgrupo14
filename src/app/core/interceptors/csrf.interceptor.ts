import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfService } from '../services/csrf.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfService);
  const metodosProtegidos = ['POST', 'PUT', 'DELETE', 'PATCH'];

  let cloned = req.clone({ withCredentials: true });

  if (metodosProtegidos.includes(req.method)) {
    const token = csrfService.getToken();
    if (token) {
      cloned = cloned.clone({ setHeaders: { 'x-xsrf-token': token } });
    }
  }

  return next(cloned);
};