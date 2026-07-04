import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dolar-card',
  imports: [CommonModule],
  templateUrl: './dolar-card.component.html',
  styleUrl: './dolar-card.component.scss',
  standalone: true
})
export class DolarCardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  compra = '';
  venta = '';
  fecha: Date | null = null;

  ngOnInit(): void {
    this.dashboardService.getCotizacionDolar().subscribe({
      next: data => {
        this.compra = data.compra;
        this.venta = data.venta;
        this.fecha = data.fecha ? new Date(data.fecha) : null;
      },
      error: err => {
        console.error('Error al cargar cotización del dólar:', err);
      }
    });
  }
}
