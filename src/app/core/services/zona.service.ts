import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Zona {
  id: number;
  nombre: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ZonaService {
  private api = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/zonas`;

  getAll() {
    return this.api.get<ApiResponse<Zona[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }

  getById(id: number) {
    return this.getAll().pipe(
      switchMap(zonas => {
        const zona = zonas.find(z => z.id === id);
        return zona
          ? of(zona)
          : throwError(() => ({ error: { message: 'Zona no encontrada' } }));
      })
    );
  }

  create(zona: Partial<Zona>) {
    return this.api.post<ApiResponse<Zona>>(this.baseUrl, zona).pipe(
      map(res => res.data)
    );
  }

  update(id: number, zona: Partial<Zona>) {
    return this.api.put<ApiResponse<Zona>>(`${this.baseUrl}/${id}`, zona).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
