import { Component, OnInit, inject } from '@angular/core';
import { Transaccion } from '../transaccion';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { Sucursal } from '../../sucursales/sucursal.model';

@Component({
  selector: 'app-transaccion-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './transaccion-list.component.html',
  styleUrl: './transaccion-list.component.scss'
})
export class TransaccionListComponent implements OnInit {

  private transaccionService = inject(TransaccionService);
  private sucursalService = inject(SucursalService);

  transacciones: Transaccion[] = [];
  sucursales: Sucursal[] = [];

  filtroTipo = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroSucursalId: number | null = null;

  ngOnInit(): void {
    this.sucursalService.getAll().subscribe({
      next: (data) => this.sucursales = data,
      error: (err) => console.error('Error al cargar sucursales', err)
    });
    this.cargarTransacciones();
  }

  cargarTransacciones(): void {
    const filtros: any = {};
    if (this.filtroTipo) filtros.tipo = this.filtroTipo;
    if (this.filtroFechaDesde) filtros.fechaDesde = this.filtroFechaDesde;
    if (this.filtroFechaHasta) filtros.fechaHasta = this.filtroFechaHasta;
    if (this.filtroSucursalId) filtros.sucursalId = this.filtroSucursalId;

    this.transaccionService.getAll(filtros).subscribe({
      next: (data) => this.transacciones = data,
      error: (err) => console.error('Error al cargar transacciones', err)
    });
  }

  limpiarFiltros(): void {
    this.filtroTipo = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroSucursalId = null;
    this.cargarTransacciones();
  }

  eliminarTransaccion(id: number): void {
    if(confirm('¿Estás seguro de anular esta transacción?')) {
      this.transaccionService.delete(id).subscribe({
        next: () => this.cargarTransacciones(),
        error: (err) => console.error('Error al anular transacción', err)
      });
    }
  }
}
