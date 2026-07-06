import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteAgente } from '../reporte-agente';
import { ReporteAgenteService } from '../../core/services/reporte-agente.service';

@Component({
  selector: 'app-reporte-agente-detalle',
  imports: [CommonModule],
  templateUrl: './reporte-agente-detalle.component.html',
  styleUrl: './reporte-agente-detalle.component.scss'
})
export class ReporteAgenteDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reporteService = inject(ReporteAgenteService);

  reporte: ReporteAgente | null = null;
  errorMsg = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMsg = 'ID de reporte no válido';
      return;
    }
    this.reporteService.getById(id).subscribe({
      next: (data) => {
        if (!data) {
          this.errorMsg = 'Reporte no encontrado';
          return;
        }
        this.reporte = data;
      },
      error: () => this.errorMsg = 'Error al cargar el reporte'
    });
  }

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

  volver(): void {
    this.router.navigate(['/reportes']);
  }
}
