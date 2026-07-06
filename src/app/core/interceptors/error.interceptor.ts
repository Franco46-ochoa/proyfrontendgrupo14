import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          toastr.error('Sesion expirada. Inicia sesion nuevamente.',
            '401 Unauthorized'
          );
          break;

          case 403:
            toastr.error('No tienes permisos para realizar esta accion.',
              '403 Forbidden'
            );
            break;

            case 500:
              toastr.error('Error interno del servidor.',
                '500 Internal Server Error'
              );
              break;

              default:
                toastr.error('Ocurrio un error inesperado.',
                  'Error'
                );
      }
      return throwError(() => error);
    })

  );
};
