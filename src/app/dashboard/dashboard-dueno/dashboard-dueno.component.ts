import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { SucursalMapaComponent } from '../../sucursales/sucursal-mapa/sucursal-mapa.component';
import { DashboardService } from '../../core/services/dashboard.service'; // <-- Importar servicio
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { DolarCardComponent } from '../../shared/components/dolar-card/dolar-card.component';
import { ExportPdfService } from '../../core/services/export-pdf.service';
import { ExportExcelService } from '../../core/services/export-excel.service';


@Component({
  selector: 'app-dashboard-dueno',
  imports: [
    CommonModule,
    KpiCardComponent,
    ChartCardComponent,
    SucursalMapaComponent,
    DolarCardComponent
  ],
  templateUrl: './dashboard-dueno.component.html',
  styleUrl: './dashboard-dueno.component.scss'
})
export class DashboardDuenoComponent implements OnInit {
  private dashboardService = inject(DashboardService); // <-- Inyectar servicio
  private exportPdfService = inject(ExportPdfService);
  private exportExcelService = inject(ExportExcelService);
  fechaActual: string = '';

  kpis: any[] = [];
  sucursales: any[] = []; // <-- Arreglo para almacenar sucursales reales del backend

  // Gráfico de Barras
  public barChartType = 'bar' as const;
  public barChartData!: ChartData<'bar'>;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } }
  };

  // Gráfico de Línea
  public lineChartType = 'line' as const;
  public lineChartData!: ChartData<'line'>;
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } }
  };

  ngOnInit(): void {
    const hoy = new Date();
    const diaSemana = hoy.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
    const diaNumero = hoy.getDate();
    const mes = hoy.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    const anio = hoy.getFullYear();
    this.fechaActual = `${diaSemana} ${diaNumero} de ${mes} ${anio}`;

    // Cargar sucursales reales del backend y el inventario crítico combinados
    forkJoin({
      sucursales: this.dashboardService.getSucursales('dueno'),
      criticos: this.dashboardService.getInventarioCritico('dueno')
    }).subscribe({
      next: ({ sucursales, criticos }) => {
        this.sucursales = sucursales.map(suc => {
          const itemsCriticos = criticos.filter((c: any) => c.sucursalId === suc.id);
          return {
            ...suc,
            stockCriticoCount: itemsCriticos.length
          };
        });
      },
      error: err => {
        console.error('Error al cargar datos del mapa:', err);
      }
    });


    // Consumir el servicio mock
    this.dashboardService.getDashboardDueno().subscribe(data => {
      this.kpis = data.kpis;

      // Asignar datos del gráfico de barras
      this.barChartData = {
        labels: data.barChart.labels,
        datasets: [{
          data: data.barChart.data,
          label: 'Rentabilidad ($)',
          backgroundColor: '#1A3A5C',
          hoverBackgroundColor: '#F59E0B',
          borderRadius: 6
        }]
      };

      // Asignar datos del gráfico de líneas
      this.lineChartData = {
        labels: data.lineChart.labels,
        datasets: [{
          data: data.lineChart.data,
          label: 'Ingresos Mensuales ($)',
          borderColor: '#0D9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    });
  }

  exportarPdf() {
    this.exportPdfService.exportarElementoAPdf('dashboard-dueno-pdf', 'reporte-dueno.pdf');
  }

  exportarExcel() {
    const datosExcel = this.sucursales.map(s => ({
      Sucursal: s.nombre,
      Direccion: s.direccion || 'Sin dirección',
      Telefono: s.telefono || 'Sin teléfono',
      'Stock Crítico': s.stockCriticoCount || 0
    }));
    this.exportExcelService.exportarDatosAExcel(datosExcel, 'Sucursales', 'reporte-sucursales.xlsx');
  }
}
