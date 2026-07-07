import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Auditoria } from '../../auditoria/auditoria';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private api = inject(ApiService);
  private baseUrl = `${environment.apiUrl}/auditoria`;

  getAll() {
    return this.api.get<ApiResponse<Auditoria[]>>(this.baseUrl).pipe(
      map(res => res.data ?? [])
    );
  }
}
