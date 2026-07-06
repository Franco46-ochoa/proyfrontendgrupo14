import { Component, OnInit, inject } from '@angular/core';
import { Gasto } from '../gasto';
import { CommonModule } from '@angular/common';
import { ExportExcelService } from '../../core/services/export-excel.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GastoService } from '../../core/services/gasto.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { Sucursal } from '../../sucursales/sucursal.model';

@Component({
  selector: 'app-gasto-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './gasto-list.component.html',
  styleUrl: './gasto-list.component.scss'
})
export class GastoListComponent implements OnInit {
  private gastoService = inject(GastoService);
  private sucursalService = inject(SucursalService);
  private exportExcelService = inject(ExportExcelService);

  gastos: Gasto[] = [];
  sucursales: Sucursal[] = [];
  rol = '';
  filtroTipo = '';
  filtroSucursal = '';


  get esEmpleado() { return this.rol === 'empleado'; }


  ngOnInit(): void {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
    this.gastoService.getAll().subscribe(data => this.gastos = data);
    this.sucursalService.getAll().subscribe(data => this.sucursales = data);
  }

  get filtrados(): Gasto[] {
    return this.gastos.filter(g =>
      (!this.filtroTipo || g.tipo === this.filtroTipo) &&
      (!this.filtroSucursal || g.sucursalId === Number(this.filtroSucursal))
    );
  }

  get esDueno() { return this.rol === 'dueno'; }
  get esGerente() { return this.rol === 'gerente'; }
  get puedeEditar() { return this.esGerente; }
  get puedeEliminar() { return this.esGerente; }

  eliminarGasto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      this.gastoService.delete(id).subscribe({ next: () => this.ngOnInit() });
    }
  }
  esDuenoOAdmin(): boolean {
    const rol = (localStorage.getItem('role') || '').toLowerCase();
    return rol === 'dueno' || rol === 'administrador';
  }

  exportarExcel(): void {
    this.exportExcelService.exportarGastos(this.gastos);
  }

  exportarPdf(): void {
    // Cuando el backend esté listo: window.open('/api/export/gastos/pdf', '_blank');
    alert('Conexión maquetada: Llamando a GET /api/export/gastos/pdf en el backend.');
  }
}
