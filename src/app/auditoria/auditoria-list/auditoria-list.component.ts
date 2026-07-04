import { Component, OnInit, inject } from '@angular/core';
import { Auditoria, AccionAuditoria } from '../auditoria';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService } from '../../core/services/auditoria.service';

@Component({
  selector: 'app-auditoria-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria-list.component.html',
  styleUrl: './auditoria-list.component.scss'
})
export class AuditoriaListComponent implements OnInit {
  private auditoriaService = inject(AuditoriaService);

  registros: Auditoria[] = [];
  filtroAccion = '';
  filtroEntidad = '';
  filtroUsuario = '';
  paginaActual = 1;
  itemsPorPagina = 15;

  ngOnInit(): void {
    this.auditoriaService.getAll().subscribe(data => this.registros = data);
  }

  get accionFiltered(): Auditoria[] {
    let result = this.registros;
    if (this.filtroAccion) {
      result = result.filter(r => r.accion === this.filtroAccion);
    }
    if (this.filtroEntidad) {
      result = result.filter(r =>
        r.entidad.toLowerCase().includes(this.filtroEntidad.toLowerCase())
      );
    }
    if (this.filtroUsuario) {
      result = result.filter(r =>
        r.usuario.toLowerCase().includes(this.filtroUsuario.toLowerCase())
      );
    }
    return result;
  }

  get totalPaginas(): number {
    return Math.ceil(this.accionFiltered.length / this.itemsPorPagina) || 1;
  }

  get paginaActualItems(): Auditoria[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.accionFiltered.slice(start, start + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  claseBadge(accion: AccionAuditoria): string {
    const map: Record<AccionAuditoria, string> = {
      CREATE: 'bg-success',
      UPDATE: 'bg-info',
      DELETE: 'bg-danger',
      LOGIN: 'bg-primary',
      EXPORT: 'bg-secondary'
    };
    return map[accion] || 'bg-secondary';
  }

  formatoFecha(fecha: string): string {
    if (!fecha) return '—';
    const d = new Date(fecha);
    return d.toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatoJson(data: any): string {
    if (!data) return '—';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }
}
