import { Component, OnInit, inject } from '@angular/core';
import { Inventario } from '../inventario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportExcelService } from '../../core/services/export-excel.service';
import { InventarioService } from '../../core/services/inventario.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { ProductoService } from '../../core/services/producto.service';
import { Sucursal } from '../../sucursales/sucursal.model';
import { Producto } from '../producto.model';

@Component({
  selector: 'app-stock-sucursal',
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-sucursal.component.html',
  styleUrl: './stock-sucursal.component.scss'
})
export class StockSucursalComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  private sucursalService = inject(SucursalService);
  private productoService = inject(ProductoService);

  inventario: Inventario[] = [];
  sucursales: Sucursal[] = [];
  productos: Producto[] = [];
  soloCritico = false;
  editandoId: number | null = null;
  editData = { stockActual: 0, stockMinimo: 0, precioVenta: 0 };
  nuevoForm = false;
  nuevo = { productoId: 0, sucursalId: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0, precioVenta: 0 };
  rol = '';

  get esDueno() { return this.rol === 'dueno'; }
  get esEmpleado() { return this.rol === 'empleado'; }

  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
    this.cargar();
    this.sucursalService.getAll().subscribe(data => this.sucursales = data);
    this.productoService.getAll().subscribe(data => this.productos = data);
  }

  cargar(): void {
    this.inventarioService.getAll(this.soloCritico).subscribe(data => this.inventario = data);
  }

  toggleCritico(): void {
    this.soloCritico = !this.soloCritico;
    this.cargar();
  }

  abrirForm(): void {
    this.nuevoForm = true;
    this.nuevo = { productoId: 0, sucursalId: 0, stockActual: 0, stockMinimo: 0, stockMaximo: 0, precioVenta: 0 };
  }

  crear(): void {
    const p: any = { productoId: this.nuevo.productoId, sucursalId: this.nuevo.sucursalId, stockActual: this.nuevo.stockActual, stockMinimo: this.nuevo.stockMinimo, precioVenta: this.nuevo.precioVenta };
    if (this.nuevo.stockMaximo) p.stockMaximo = this.nuevo.stockMaximo;
    this.inventarioService.create(p).subscribe({ next: () => { this.nuevoForm = false; this.cargar(); } });
  }

  editar(item: Inventario): void {
    this.editandoId = item.id;
    this.editData = { stockActual: item.stockActual, stockMinimo: item.stockMinimo, precioVenta: item.precioVenta };
  }

  cancelarEdicion(): void { this.editandoId = null; }

  guardar(item: Inventario): void {
    this.inventarioService.update(item.id, this.editData).subscribe({ next: () => { this.editandoId = null; this.cargar(); } });
  }
  
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
