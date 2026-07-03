import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
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
}
