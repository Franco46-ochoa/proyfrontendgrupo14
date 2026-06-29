import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart-card',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss'
})
export class ChartCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() chartType: ChartType = 'bar';
  @Input() chartData!: ChartData<any>;
  @Input() chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };
}
