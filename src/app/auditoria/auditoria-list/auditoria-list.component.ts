import { Component, OnInit, inject } from '@angular/core';
import { Auditoria, AccionAuditoria } from '../auditoria';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { DatatableComponent } from '../../shared/components/datatable/datatable.component';

@Component({
  selector: 'app-auditoria-list',
  imports: [CommonModule, FormsModule, DatatableComponent],
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
  errorMsg = '';

  readonly columnas = ['ID', 'Acción', 'Entidad', 'ID Entidad', 'Usuario', 'Fecha'];

  ngOnInit(): void {
    this.auditoriaService.getAll().subscribe({
      next: (data) => this.registros = data,
      error: () => this.errorMsg = 'Error al cargar registros de auditoría. Verifique que el backend esté disponible.'
    });
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

  get displayData(): any[] {
    return this.paginaActualItems.map(r => ({
      'ID': r.id,
      'Acción': this.textoAccion(r.accion),
      'Entidad': r.entidad,
      'ID Entidad': r.entidadId ?? '—',
      'Usuario': r.usuario,
      'Fecha': this.formatoFecha(r.fecha),
    }));
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  textoAccion(accion: AccionAuditoria): string {
    const map: Record<AccionAuditoria, string> = {
      CREATE: '[CREADO]',
      UPDATE: '[MODIFICADO]',
      DELETE: '[ELIMINADO]',
      LOGIN: '[INICIO SESIÓN]',
      EXPORT: '[EXPORTADO]'
    };
    return map[accion] || accion;
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
}
