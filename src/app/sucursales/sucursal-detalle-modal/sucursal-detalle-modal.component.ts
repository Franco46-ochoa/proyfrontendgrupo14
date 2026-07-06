import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sucursal } from '../sucursal.model';
import { SucursalService } from '../../core/services/sucursal.service';

@Component({
  selector: 'app-sucursal-detalle-modal',
  imports: [CommonModule],
  templateUrl: './sucursal-detalle-modal.component.html',
})
export class SucursalDetalleModalComponent {
  private sucursalService = inject(SucursalService);

  visible = false;
  sucursal: Sucursal | null = null;
  errorMsg = '';
  cargando = false;

  abrir(id: number): void {
    this.visible = true;
    this.cargando = true;
    this.errorMsg = '';
    this.sucursal = null;

    this.sucursalService.getById(id).subscribe({
      next: (data) => {
        this.sucursal = data;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar los datos de la sucursal';
        this.cargando = false;
      }
    });
  }

  cerrar(): void {
    this.visible = false;
  }
}
