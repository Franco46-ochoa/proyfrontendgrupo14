import { Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Proveedor } from '../../shared/models/proveedor.model';
import { ApiService } from './api.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/proveedores';

  getAll() {
    return this.api.get<ApiResponse<Proveedor[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }

  getById(id: number) {
    return this.getAll().pipe(
      switchMap(proveedores => {
        const proveedor = proveedores.find(p => p.id === id);
        return proveedor
          ? of(proveedor)
          : throwError(() => ({ error: { message: 'Proveedor no encontrado' } }));
      })
    );
  }

  create(proveedor: Proveedor) {
    return this.api.post<ApiResponse<Proveedor>>(this.baseUrl, proveedor).pipe(
      map(res => res.data)
    );
  }

  update(id: number, proveedor: Partial<Proveedor>) {
    return this.api.put<ApiResponse<Proveedor>>(`${this.baseUrl}/${id}`, proveedor).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
