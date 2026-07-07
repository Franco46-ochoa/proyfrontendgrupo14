import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SuscripcionData {
  plan: string;
  monto: number;
  datosComprador?: any;
}

export interface MpSubscriptionData {
  plan: string;
  monto: number;
  payer_email: string;
}

@Injectable({ providedIn: 'root' })
export class SuscripcionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/suscripciones`;
  private mpBaseUrl = `${environment.apiUrl}/mp`;

  crear(datos: SuscripcionData) {
    return this.http.post<ApiResponse<any>>(this.baseUrl, datos).pipe(
      map(res => res.data)
    );
  }

  obtener() {
    return this.http.get<ApiResponse<any>>(this.baseUrl).pipe(
      map(res => res.data)
    );
  }

  crearPreferenciaMP(datos: MpSubscriptionData) {
    return this.http.post<any>(`${this.mpBaseUrl}/subscription`, datos);
  }
}
