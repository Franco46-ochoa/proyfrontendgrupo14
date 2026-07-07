import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  cargarDatosHistoricos() {
    return this.http.post<{ success: boolean; message: string; data: any }>(
      `${this.apiUrl}/seed`,
      {}
    );
  }
}
