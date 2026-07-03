import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Inventario } from '../../inventario/inventario';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/inventario';

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
