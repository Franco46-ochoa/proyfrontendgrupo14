import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { Gasto } from '../../gastos/gasto';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private api = inject(ApiService);
  private baseUrl = `${environment.apiUrl}/gastos`;

  getAll() {
    return this.api.get<ApiResponse<Gasto[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }

  getById(id: number) {
    return this.getAll().pipe(
      switchMap(gastos => {
        const gasto = gastos.find(g => g.id === id);
        return gasto
          ? of(gasto)
          : throwError(() => ({ error: { message: 'Gasto no encontrado' } }));
      })
    );
  }

  create(gasto: Gasto) {
    return this.api.post<ApiResponse<Gasto>>(this.baseUrl, gasto).pipe(
      map(res => res.data)
    );
  }

  update(id: number, gasto: Partial<Gasto>) {
    return this.api.put<ApiResponse<Gasto>>(`${this.baseUrl}/${id}`, gasto).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
