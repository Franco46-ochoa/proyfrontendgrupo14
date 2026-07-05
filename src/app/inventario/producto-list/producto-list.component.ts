import { Component, OnInit, inject } from '@angular/core';
import { Producto } from '../producto.model';
import { CommonModule } from '@angular/common';
import { ExportExcelService } from '../../core/services/export-excel.service';

@Component({
  selector: 'app-producto-list',
  imports: [ CommonModule ],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.scss'
})
export class ProductoListComponent implements OnInit {
  private exportExcelService = inject(ExportExcelService);

  productos: Producto[] = [
    { id: 1, nombre: 'Leche Descremada', codigo: 'PROD-001', categoria: 'Lácteos', precioCompra: 850.50, unidadMedida: 'Litro' },
    { id: 2, nombre: 'Harina 0000', codigo: 'PROD-002', categoria: 'Almacén', precioCompra: 450.00, unidadMedida: 'Kg' },
    { id: 3, nombre: 'Pan Lactal', codigo: 'PROD-003', categoria: 'Panadería', precioCompra: 1200.00, unidadMedida: 'Unidad' }
  ];

  constructor() { }

  ngOnInit(): void { }

  esDuenoOAdmin(): boolean {
    const rol = (localStorage.getItem('role') || '').toLowerCase();
    return rol === 'dueno' || rol === 'administrador';
  }

  exportarExcel(): void {
    this.exportExcelService.exportarProductos(this.productos);
  }

  eliminarProducto(id: number | undefined) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      console.log('Eliminar producto con ID:', id);
    }
  }
}
