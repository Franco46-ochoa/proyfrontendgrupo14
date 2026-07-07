import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Inventario {
  id?: number;
  productoId: number;
  sucursalId: number;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  precioVenta: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private api = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/inventario`;

  getAll(stockCritico?: boolean) {
    let params = new HttpParams();
    if (stockCritico) params = params.set('stockCritico', 'true');
    return this.api.get<ApiResponse<Inventario[]>>(this.baseUrl, { params }).pipe(
      map(res => res.data ?? [])
    );
  }

  create(data: Partial<Inventario>) {
    return this.api.post<ApiResponse<Inventario>>(this.baseUrl, data).pipe(
      map(res => res.data)
    );
  }

  update(id: number, data: Partial<Inventario>) {
    return this.api.put<ApiResponse<Inventario>>(`${this.baseUrl}/${id}`, data).pipe(
      map(res => res.data)
    );
  }
}
