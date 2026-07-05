import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { Producto } from '../../inventario/producto.model';
import { ApiService } from './api.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/productos';

  getAll() {
    return this.api.get<ApiResponse<Producto[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }

  getById(id: number) {
    return this.getAll().pipe(
      switchMap(productos => {
        const producto = productos.find(p => p.id === id);
        return producto
          ? of(producto)
          : throwError(() => ({ error: { message: 'Producto no encontrado' } }));
      })
    );
  }

  create(producto: Producto) {
    return this.api.post<ApiResponse<Producto>>(this.baseUrl, producto).pipe(
      map(res => res.data)
    );
  }

  update(id: number, producto: Partial<Producto>) {
    return this.api.put<ApiResponse<Producto>>(`${this.baseUrl}/${id}`, producto).pipe(
      map(res => res.data)
    );
  }

  delete(id: number) {
    return this.api.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
