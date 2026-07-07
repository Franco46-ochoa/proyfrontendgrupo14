import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { SucursalMapaComponent } from '../../sucursales/sucursal-mapa/sucursal-mapa.component';
import { DashboardService } from '../../core/services/dashboard.service'; // <-- Importar
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard-gerente',
  imports: [
    CommonModule,
    ChartCardComponent,
    SucursalMapaComponent
  ],
  templateUrl: './dashboard-gerente.component.html',
  styleUrl: './dashboard-gerente.component.scss'
})
export class DashboardGerenteComponent implements OnInit {
  private dashboardService = inject(DashboardService); // <-- Inyectar

  nombreZona: string = '';
  textoReporte: string = '';
  fechaReporte: string = '';
  sucursales: any[] = []; // <-- Arreglo para almacenar sucursales de la zona del gerente

  // Gráfico Radar
  public radarChartType = 'radar' as const;
  public radarChartData!: ChartData<'radar'>;
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  // Gráfico Dona
  public pieChartType = 'doughnut' as const;
  public pieChartData!: ChartData<'doughnut'>;
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  ngOnInit(): void {
    // Cargar sucursales de la zona desde el backend
    this.dashboardService.getSucursales().subscribe(data => {
      this.sucursales = data;
    });

    // Consumir datos enviando el id de zona mock 'norte'
    this.dashboardService.getDashboardGerente('norte').subscribe(data => {
      this.nombreZona = data.zona;
      this.textoReporte = data.reporteNLP.texto;
      this.fechaReporte = data.reporteNLP.fecha;

      // Radar
      this.radarChartData = {
        labels: data.radarChart.labels,
        datasets: data.radarChart.datasets
      };

      // Dona
      this.pieChartData = {
        labels: data.pieChart.labels,
        datasets: [{
          data: data.pieChart.data,
          backgroundColor: ['#1A3A5C', '#F59E0B', '#0D9488', '#EF4444', '#64748B'],
          hoverOffset: 4
        }]
      };
    });
  }

}
