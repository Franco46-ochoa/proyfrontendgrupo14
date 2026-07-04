import { Component, OnInit, inject } from '@angular/core';
import { Transaccion } from '../transaccion';
import { CommonModule } from '@angular/common';
import { ExportPdfService } from '../../core/services/export-pdf.service';
import { ExportExcelService } from '../../core/services/export-excel.service';

@Component({
  selector: 'app-transaccion-list',
  imports: [CommonModule],
  templateUrl: './transaccion-list.component.html',
  styleUrl: './transaccion-list.component.scss'
})
export class TransaccionListComponent implements OnInit {
  private exportPdfService = inject(ExportPdfService);
  private exportExcelService = inject(ExportExcelService);

  transacciones: Transaccion[] = [
    { id: 45, fecha: '10/06/26', tipo: 'Venta', cantidad: 5, precioUnitario: 1750, total: 1750 },
    { id: 44, fecha: '10/06/26', tipo: 'Compra', cantidad: 20, precioUnitario: 1000, total: 1000 },
    { id: 43, fecha: '09/06/26', tipo: 'Venta', cantidad: 10, precioUnitario: 1500, total: 1500 }
  ];

  constructor() { }

  ngOnInit(): void { }

  eliminarTransaccion(id: number) {
    if(confirm('¿Estás seguro de anular esta transacción?')) {
      console.log('Anular transacción ID:', id);
    }
  }

  exportarPdf() {
    this.exportPdfService.exportarElementoAPdf('transacciones-pdf', 'listado-transacciones.pdf');
  }

  exportarExcel() {
    this.exportExcelService.exportarDatosAExcel(this.transacciones, 'Transacciones', 'listado-transacciones.xlsx');
  }
}
