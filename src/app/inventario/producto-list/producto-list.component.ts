import { Component, OnInit, inject } from '@angular/core';
import { Producto } from '../producto.model';
import { CommonModule } from '@angular/common';
import { ExportExcelService } from '../../core/services/export-excel.service';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-producto-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.scss'
})

export class ProductoListComponent implements OnInit {
  private exportExcelService = inject(ExportExcelService);

  private productoService = inject(ProductoService);
  productos: Producto[] = [];
  cargando = false;
  error = '';
  rol = '';

  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
    this.cargarProductos();
  }

  get esDueno() { return this.rol === 'dueno'; }
  get esEmpleado() { return this.rol === 'empleado'; }
  get esGerente() { return this.rol === 'gerente'; }
  get puedeEditar() { return this.esGerente; }
  get puedeEliminar() { return this.esGerente; }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          precioCompra: Number(p.precioCompra)
        }));
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudieron cargar los productos';
        this.cargando = false;
      }
    });
  }

  eliminarProducto(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.id !== id);
        },
        error: (err) => {
          alert(err.error?.message || 'Error al eliminar el producto');
        }
      });
    }
  }
  esDuenoOAdmin(): boolean {
    const rol = (localStorage.getItem('role') || '').toLowerCase();
    return rol === 'dueno' || rol === 'administrador';
  }
  exportarExcel(): void {
    this.exportExcelService.exportarProductos(this.productos);
  }
}



