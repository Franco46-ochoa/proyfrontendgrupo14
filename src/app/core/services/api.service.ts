import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  get<T>(url: string, options?: { params?: HttpParams }) {
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(url, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(url, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(url);
  }

}