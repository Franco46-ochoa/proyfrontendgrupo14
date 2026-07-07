import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private http = inject(HttpClient);
  private token: string | null = null;

  fetchToken() {
    return this.http.get<{ csrfToken: string }>(`${environment.apiUrl}/csrf-token`, { withCredentials: true })
      .pipe(tap(res => this.token = res.csrfToken));
  }

  getToken(): string | null {
    return this.token;
  }
}