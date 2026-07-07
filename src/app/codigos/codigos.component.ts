import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-codigos',
  imports: [CommonModule, FormsModule],
  templateUrl: 'codigos.component.html',
  styleUrls: ['codigos.component.scss']
})
export class CodigosComponent implements OnInit {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/codigos`;

  codigos: any[] = [];

  rolUsuario = (() => {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol || '';
    } catch { return ''; }
  })();

  rolesDisponibles = this.rolUsuario.toUpperCase() === 'DUENO'
    ? [{ value: 'administrador', label: 'Administrador' }]
    : [{ value: 'gerente', label: 'Gerente' }, { value: 'empleado', label: 'Empleado' }];

  nuevo = { rol: this.rolesDisponibles[0]?.value, usosMaximos: 10, sucursalId: null as any, departamento: 'comercial' };
  error = '';
  exito = '';

  ngOnInit() { this.cargar(); }

  cargar() {
    this.http.get<any>(this.api).subscribe({ next: r => this.codigos = r.data || [], error: () => this.error = 'Error al cargar' });
  }

  generar() {
    this.error = ''; this.exito = '';
    const body: any = { rol: this.nuevo.rol, usosMaximos: this.nuevo.usosMaximos };
    if (this.nuevo.sucursalId) body.sucursalId = this.nuevo.sucursalId;
    if (this.nuevo.rol === 'empleado') body.departamento = this.nuevo.departamento;

    this.http.post<any>(`${this.api}/generar`, body)
      .subscribe({
        next: r => { this.exito = r.message; this.cargar(); this.nuevo = { rol: this.rolesDisponibles[0]?.value, usosMaximos: 10, sucursalId: null, departamento: 'comercial' }; },
        error: e => { this.error = e.error?.message || 'Error al generar'; this.exito = ''; }
      });
  }

  revocar(id: number) {
    this.http.put<any>(`${this.api}/${id}`, {})
      .subscribe({ next: () => this.cargar(), error: () => this.error = 'Error al revocar' });
  }
}
