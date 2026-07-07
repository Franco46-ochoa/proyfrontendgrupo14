import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Proveedor {
  id: number;
  nombre: string;
  cuit: string;
  contacto?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private api = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/proveedores`;

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
