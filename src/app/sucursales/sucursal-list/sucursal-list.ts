import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { Sucursal } from '../sucursal.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SucursalService } from '../../core/services/sucursal.service';
import { ZonaService } from '../../core/services/zona.service';
import { Zona } from '../../shared/models/zona.model';
import { ZonaModalComponent } from '../zona-modal/zona-modal.component';
import { SucursalDetalleModalComponent } from '../sucursal-detalle-modal/sucursal-detalle-modal.component';

@Component({
  selector: 'app-sucursal-list',
  imports: [CommonModule, RouterLink, FormsModule, ZonaModalComponent, SucursalDetalleModalComponent],
  templateUrl: './sucursal-list.html',
  styleUrl: './sucursal-list.scss',
})
export class SucursalList implements OnInit {
  private sucursalService = inject(SucursalService);
  private zonaService = inject(ZonaService);

  @ViewChild(ZonaModalComponent) zonaModal!: ZonaModalComponent;
  @ViewChild(SucursalDetalleModalComponent) detalleModal!: SucursalDetalleModalComponent;

  sucursales: Sucursal[] = [];
  zonas: Zona[] = [];
  filtroZonaId: number | null = null;
  rol = '';

  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
    this.cargarZonas();
    this.cargarSucursales();
  }

  cargarZonas(): void {
    this.zonaService.getAll().subscribe({
      next: (data) => this.zonas = data,
      error: (err) => console.error('Error al cargar zonas', err)
    });
  }

  get sucursalesFiltradas(): Sucursal[] {
    if (!this.filtroZonaId) return this.sucursales;
    return this.sucursales.filter(s => s.zonaId === this.filtroZonaId);
  }

  cargarSucursales(): void {
    this.sucursalService.getAll().subscribe({
      next: (data) => this.sucursales = data,
      error: (err) => console.error('Error al cargar sucursales', err)
    });
  }

  abrirGestionZonas(): void {
    this.zonaModal.abrir();
  }

  verDetalle(id: number): void {
    this.detalleModal.abrir(id);
  }

  get esDueno() { return this.rol === 'dueno'; }

  eliminarSucursal(id: number | undefined): void {
    if (id !== undefined && confirm('¿Estás seguro de eliminar esta sucursal?')) {
      this.sucursalService.delete(id).subscribe({
        next: () => this.cargarSucursales(),
        error: (err) => console.error('Error al eliminar sucursal', err)
      });
    }
  }
}
