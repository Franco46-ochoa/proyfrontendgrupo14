import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  console.log('Interceptor ejecutado');

  if (token) {

     console.log('Token encontrado:', token);

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req);
};