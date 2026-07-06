import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReporteAgente, TIPOS_AGENTE } from '../reporte-agente';
import { ReporteAgenteService } from '../../core/services/reporte-agente.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { Sucursal } from '../../sucursales/sucursal.model';

@Component({
  selector: 'app-reporte-agente-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reporte-agente-list.component.html',
  styleUrl: './reporte-agente-list.component.scss'
})
export class ReporteAgenteListComponent implements OnInit {
  private reporteService = inject(ReporteAgenteService);
  private sucursalService = inject(SucursalService);

  reportes: ReporteAgente[] = [];
  reportesFiltrados: ReporteAgente[] = [];
  sucursales: Sucursal[] = [];
  rol = '';
  errorMsg = '';

  filtroTipo = '';
  filtroSucursalId: number | null = null;
  filtroFechaDesde = '';
  filtroFechaHasta = '';

  tiposAgente = TIPOS_AGENTE;

  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
    this.sucursalService.getAll().subscribe({
      next: (data) => this.sucursales = data,
      error: () => this.errorMsg = 'Error al cargar sucursales'
    });
    this.reporteService.getAll().subscribe({
      next: (data) => {
        this.reportes = data;
        this.reportesFiltrados = data;
      },
      error: () => this.errorMsg = 'Error al cargar reportes'
    });
  }

  get esDueno() { return this.rol === 'dueno'; }
  get esAdmin() { return this.rol === 'admin'; }
  get esGerente() { return this.rol === 'gerente'; }
  get esEmpleado() { return this.rol === 'empleado'; }

  getIconColor(tipo: string): string {
    switch (tipo) {
      case 'stock': return '#10B981';
      case 'ventas': return '#3B82F6';
      case 'finanzas': return '#F59E0B';
      case 'anomalias': return '#EF4444';
      default: return '#64748B';
    }
  }

  getBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'stock': return 'bg-stock';
      case 'ventas': return 'bg-ventas';
      case 'finanzas': return 'bg-finanzas';
      case 'anomalias': return 'bg-anomalias';
      default: return 'bg-secondary';
    }
  }

  aplicarFiltros(): void {
    this.errorMsg = '';
    this.reportesFiltrados = this.reportes.filter(r => {
      if (this.filtroTipo && r.tipo !== this.filtroTipo) return false;
      if (this.filtroSucursalId && r.sucursalId !== this.filtroSucursalId) return false;
      if (this.filtroFechaDesde && new Date(r.fecha) < new Date(this.filtroFechaDesde)) return false;
      if (this.filtroFechaHasta) {
        const hasta = new Date(this.filtroFechaHasta);
        hasta.setHours(23, 59, 59);
        if (new Date(r.fecha) > hasta) return false;
      }
      return true;
    });
  }

  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroSucursalId = null;
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.reportesFiltrados = this.reportes;
  }
}
