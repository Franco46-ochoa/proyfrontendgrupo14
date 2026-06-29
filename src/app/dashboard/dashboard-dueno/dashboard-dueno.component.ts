import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { SucursalMapaComponent } from '../../sucursales/sucursal-mapa/sucursal-mapa.component';
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
export class DashboardDuenoComponent {
  kpis = [
    {
      title: 'Venta Total',
      value: '$15,240',
      badgeText: '+12.5%',
      badgeColor: 'success' as const,
      icon: 'bi-cart-fill'
    },
    {
      title: 'Nuevos Clientes',
      value: '1,245',
      badgeText: '+8.2%',
      badgeColor: 'success' as const,
      icon: 'bi-people-fill'
    },
    {
      title: 'Gastos Operativos',
      value: '$4,120',
      badgeText: '-3.1%',
      badgeColor: 'danger' as const,
      icon: 'bi-cash-coin'
    },
    {
      title: 'Órdenes Pendientes',
      value: '18',
      badgeText: 'Atención',
      badgeColor: 'warning' as const,
      icon: 'bi-exclamation-triangle-fill'
    }
  ];

  // 3. CONFIGURACIÓN DEL GRÁFICO DE BARRAS (Rentabilidad por Sucursal)

  public barChartType = 'bar' as const;
  public barChartData: ChartData<'bar'> = {
    labels: ['Suc. Central', 'Suc. Norte', 'Suc. Sur', 'Suc. Este', 'Suc. Oeste'],
    datasets: [
      {
        data: [45000, 32000, 28000, 15000, 22000],
        label: 'Rentabilidad ($)',
        backgroundColor: '#1A3A5C', // Color primario de tu paleta
        hoverBackgroundColor: '#F59E0B', // Color secundario (acentos/hover)
        borderRadius: 6
      }
    ]
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  // 4. CONFIGURACIÓN DEL GRÁFICO DE LÍNEA (Evolución de Ingresos)

  public lineChartType = 'line' as const;
  public lineChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [12000, 15000, 14000, 18000, 22000, 25000],
        label: 'Ingresos Mensuales ($)',
        borderColor: '#0D9488', // Color Info/Teal de tu paleta
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

}
