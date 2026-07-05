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
  rol = '';

  filtroTipo = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroSucursalId: number | null = null;

  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
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

  get esDueno() { return this.rol === 'dueno'; }
  get esGerente() { return this.rol === 'gerente'; }
  get esEmpleado() { return this.rol === 'empleado'; }
  get puedeEditar() { return this.esGerente; }
  get puedeEliminar() { return this.esGerente; }

  eliminarTransaccion(id: number): void {
    if(confirm('¿Estás seguro de anular esta transacción?')) {
      this.transaccionService.delete(id).subscribe({
        next: () => this.cargarTransacciones(),
        error: (err) => console.error('Error al anular transacción', err)
      });
    }
  }
}
