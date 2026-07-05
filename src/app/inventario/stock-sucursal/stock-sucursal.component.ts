import { Component, OnInit, inject } from '@angular/core';
import { Inventario } from '../inventario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportExcelService } from '../../core/services/export-excel.service';

@Component({
  selector: 'app-stock-sucursal',
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-sucursal.component.html',
  styleUrl: './stock-sucursal.component.scss'
})
export class StockSucursalComponent implements OnInit{
  private exportExcelService = inject(ExportExcelService);

  inventario: Inventario[] = [
    { id: 1, producto: 'Leche Descremada', sucursal: 'Norte', stockActual: 5, stockMinimo: 10, precioVenta: 1000 },
    { id: 2, producto: 'Harina 0000', sucursal: 'Sur', stockActual: 25, stockMinimo: 15, precioVenta: 600 },
    { id: 3, producto: 'Pan Lactal', sucursal: 'Centro', stockActual: 2, stockMinimo: 5, precioVenta: 1500 }
  ];

  constructor() { }
  ngOnInit(): void { }

  esDuenoOAdmin(): boolean {
    const rol = (localStorage.getItem('role') || '').toLowerCase();
    return rol === 'dueno' || rol === 'administrador';
  }

  exportarExcel(): void {
    this.exportExcelService.exportarInventario(this.inventario);
  }

  exportarPdf(): void {
    // Cuando el backend esté listo: window.open('/api/export/inventario/pdf', '_blank');
    alert('Conexión maquetada: Llamando a GET /api/export/inventario/pdf en el backend.');
  }
}
