import { Component, OnInit, inject } from '@angular/core';
import { Proveedor } from '../../shared/models/proveedor.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../core/services/proveedor.service';

@Component({
  selector: 'app-proveedor-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.scss'
})
export class ProveedorListComponent implements OnInit {
  private proveedorService = inject(ProveedorService);

  proveedores: Proveedor[] = [];
  filtroNombre = '';
  rol = '';

  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
    this.proveedorService.getAll().subscribe(data => this.proveedores = data);
  }

  get esDueno() { return this.rol === 'dueno'; }
  get esGerente() { return this.rol === 'gerente'; }
  get puedeCrearOEditar() { return this.esDueno || this.esGerente; }
  get puedeEliminar() { return this.esDueno; }

  get filtrados(): Proveedor[] {
    if (!this.filtroNombre) return this.proveedores;
    const f = this.filtroNombre.toLowerCase();
    return this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(f) ||
      p.cuit.toLowerCase().includes(f) ||
      (p.contacto && p.contacto.toLowerCase().includes(f))
    );
  }

  eliminarProveedor(id: number): void {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedorService.delete(id).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert('Error al eliminar el proveedor')
      });
    }
  }
}
