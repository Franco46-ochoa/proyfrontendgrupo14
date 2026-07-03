import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Sucursal } from '../../sucursales/sucursal.model';
import { ApiService } from './api.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/sucursales';

  getAll() {
    return this.api.get<ApiResponse<Sucursal[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }

  getById(id: number) {
    return this.getAll().pipe(
      switchMap(sucursales => {
        const sucursal = sucursales.find(s => s.id === id);
        return sucursal
          ? of(sucursal)
          : throwError(() => ({ error: { message: 'Sucursal no encontrada' } }));
      })
    );
  }

  create(sucursal: Sucursal) {
    return this.api.post<ApiResponse<Sucursal>>(this.baseUrl, sucursal).pipe(
      map(res => res.data)
    );
  }

  update(id: number, sucursal: Partial<Sucursal>) {
    return this.api.put<ApiResponse<Sucursal>>(`${this.baseUrl}/${id}`, sucursal).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
