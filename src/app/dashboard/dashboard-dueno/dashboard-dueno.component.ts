import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { SucursalMapaComponent } from '../../sucursales/sucursal-mapa/sucursal-mapa.component';
import { DashboardService } from '../../core/services/dashboard.service'; // <-- Importar servicio
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard-dueno',
  imports: [
    CommonModule,
    KpiCardComponent,
    ChartCardComponent,
    SucursalMapaComponent
  ],
  templateUrl: './dashboard-dueno.component.html',
  styleUrl: './dashboard-dueno.component.scss'
})
export class DashboardDuenoComponent implements OnInit {
  private dashboardService = inject(DashboardService); // <-- Inyectar servicio

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
    // Cargar sucursales reales del backend
    this.dashboardService.getSucursales('dueno').subscribe(data => {
      this.sucursales = data;
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
}
