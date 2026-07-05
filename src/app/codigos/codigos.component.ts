import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-codigos',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <h3 class="text-primary fw-bold mb-3">Códigos de Invitación</h3>

      <div class="card p-4 mb-4 shadow-sm">
        <h5 class="mb-3">Generar nuevo código</h5>
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label">Rol</label>
            <select class="form-select" [(ngModel)]="nuevo.rol">
              <option value="gerente">Gerente</option>
              <option value="empleado">Empleado</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Usos máximos</label>
            <input type="number" class="form-control" [(ngModel)]="nuevo.usosMaximos" min="1" />
          </div>
          <div class="col-md-3">
            <label class="form-label">ID Sucursal (opcional)</label>
            <input type="number" class="form-control" [(ngModel)]="nuevo.sucursalId" />
          </div>
          <div class="col-md-3">
            <button class="btn btn-success w-100" (click)="generar()">
              <i class="bi bi-plus-circle me-1"></i> Generar
            </button>
          </div>
        </div>
        <div *ngIf="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
        <div *ngIf="exito" class="alert alert-success mt-3 mb-0">{{ exito }}</div>
      </div>

      <div class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Rol</th>
                <th>Usos</th>
                <th>Estado</th>
                <th>Sucursal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of codigos">
                <td><code>{{ c.codigo }}</code></td>
                <td><span class="badge bg-secondary">{{ c.rol }}</span></td>
                <td>{{ c.usosRealizados }} / {{ c.usosMaximos }}</td>
                <td>
                  <span [class]="'badge ' + (c.activo ? (c.usosRealizados >= c.usosMaximos ? 'bg-warning' : 'bg-success') : 'bg-danger')">
                    {{ c.activo ? (c.usosRealizados >= c.usosMaximos ? 'Agotado' : 'Activo') : 'Revocado' }}
                  </span>
                </td>
                <td>{{ c.sucursalId || '—' }}</td>
                <td>
                  <button *ngIf="c.activo" class="btn btn-sm btn-outline-danger" (click)="revocar(c.id)">
                    Revocar
                  </button>
                </td>
              </tr>
              <tr *ngIf="codigos.length === 0">
                <td colspan="6" class="text-center text-muted py-3">No hay códigos generados aún</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CodigosComponent implements OnInit {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/codigos';

  codigos: any[] = [];
  nuevo = { rol: 'empleado', usosMaximos: 10, sucursalId: null as any };
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

    this.http.post<any>(`${this.api}/generar`, body)
      .subscribe({
        next: r => { this.exito = r.message; this.cargar(); this.nuevo = { rol: 'empleado', usosMaximos: 10, sucursalId: null }; },
        error: e => { this.error = e.error?.message || 'Error al generar'; this.exito = ''; }
      });
  }

  revocar(id: number) {
    this.http.put<any>(`${this.api}/${id}`, {})
      .subscribe({ next: () => this.cargar(), error: () => this.error = 'Error al revocar' });
  }
}
