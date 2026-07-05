import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @Input() title: string = 'Indicador';
  @Input() value: string | number = '0';
  @Input() badgeText: string = '';
  @Input() icon: string = '';
  // Usamos las clases de bootstrap para los colores
  @Input() badgeColor: 'success' | 'danger' | 'warning' | 'info' | 'secondary' = 'success';
}
