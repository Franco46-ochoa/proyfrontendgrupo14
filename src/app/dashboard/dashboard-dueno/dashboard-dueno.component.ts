import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';

@Component({
  selector: 'app-dashboard-dueno',
  imports: [CommonModule, KpiCardComponent, ChartCardComponent],
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
}
