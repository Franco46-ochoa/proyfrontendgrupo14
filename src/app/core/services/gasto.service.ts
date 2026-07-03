import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Gasto } from '../../gastos/gasto';

@Injectable({
  providedIn: 'root'
})
export class GastoService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/gastos';

  getAll() {
    return this.api.get<Gasto[]>(this.baseUrl);
  }

  create(gasto: Gasto) {
    return this.api.post<Gasto>(this.baseUrl, gasto);
  }
  
  update(gasto: Gasto) {
    return this.api.put<Gasto>(this.baseUrl, gasto);
  }

  delete(id: number) {
    return this.api.delete<Gasto>(`${this.baseUrl}/${id}`);
  }
}
