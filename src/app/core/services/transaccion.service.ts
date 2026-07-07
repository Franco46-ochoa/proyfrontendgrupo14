import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Transaccion {
  id: number;
  tipo: 'venta' | 'compra';
  cantidad: number;
  precioUnitario: number;
  productoId: number;
  sucursalId: number;
  fecha?: string;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class TransaccionService {
  private api = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/transacciones`;

  getAll(filtros?: { tipo?: string; fechaDesde?: string; fechaHasta?: string; sucursalId?: number }) {
    let params = new HttpParams();
    if (filtros?.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros?.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde);
    if (filtros?.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta);
    if (filtros?.sucursalId) params = params.set('sucursalId', filtros.sucursalId.toString());
    return this.api.get<ApiResponse<Transaccion[]>>(this.baseUrl, { params }).pipe(
      map(res => res.data ?? [])
    );
  }

  getById(id: number) {
    return this.getAll().pipe(
      switchMap(transacciones => {
        const transaccion = transacciones.find(t => t.id === id);
        return transaccion
          ? of(transaccion)
          : throwError(() => ({ error: { message: 'Transacción no encontrada' } }));
      })
    );
  }

  create(transaccion: Partial<Transaccion>) {
    return this.api.post<ApiResponse<Transaccion>>(this.baseUrl, transaccion).pipe(
      map(res => res.data)
    );
  }

  update(id: number, transaccion: Partial<Transaccion>) {
    return this.api.put<ApiResponse<Transaccion>>(`${this.baseUrl}/${id}`, transaccion).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
