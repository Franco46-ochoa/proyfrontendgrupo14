import { inject, Injectable } from '@angular/core';
import { Sucursal } from '../../sucursales/sucursal.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/sucursales';

  getAll() {
    return this.api.get<Sucursal[]>(this.baseUrl);
  }

  create(sucursal: Sucursal) {
    return this.api.post<Sucursal>(this.baseUrl, sucursal);
  }
  
  update(sucursal: Sucursal) {
    return this.api.put<Sucursal>(this.baseUrl, sucursal);
  }

  delete(id: number) {
    return this.api.delete<Sucursal>(`${this.baseUrl}/${id}`);
  }
}
