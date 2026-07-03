import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Transaccion } from '../../transacciones/transaccion';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/transacciones';

  getAll() {
    return this.api.get<Transaccion[]>(this.baseUrl);
  }

  create(transaccion: Transaccion) {
    return this.api.post<Transaccion>(this.baseUrl, transaccion);
  }
  
  update(transaccion: Transaccion) {
    return this.api.put<Transaccion>(this.baseUrl, transaccion);
  }

  delete(id: number) {
    return this.api.delete<Transaccion>(`${this.baseUrl}/${id}`);
  }
}
