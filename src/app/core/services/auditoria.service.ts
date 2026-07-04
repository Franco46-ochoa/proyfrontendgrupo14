import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Auditoria } from '../../auditoria/auditoria';
import { ApiService } from './api.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private api = inject(ApiService);
  private baseUrl = 'http://localhost:3000/api/auditoria';

  getAll() {
    return this.api.get<ApiResponse<Auditoria[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }
}
