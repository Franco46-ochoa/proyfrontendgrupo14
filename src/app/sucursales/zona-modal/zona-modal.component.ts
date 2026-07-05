import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Zona } from '../../shared/models/zona.model';
import { ZonaService } from '../../core/services/zona.service';

@Component({
  selector: 'app-zona-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './zona-modal.component.html',
})
export class ZonaModalComponent {
  private zonaService = inject(ZonaService);

  onSaved = output<void>();

  visible = false;
  zonas: Zona[] = [];
  nombreInput = '';

  abrir(): void {
    this.visible = true;
    this.nombreInput = '';
    this.cargarZonas();
  }

  cerrar(): void {
    this.visible = false;
  }

  cargarZonas(): void {
    this.zonaService.getAll().subscribe({
      next: (data) => this.zonas = data,
      error: (err) => console.log('Error al cargar zonas - probablemente no autenticado'),
    });
  }

  guardar(): void {
    const nombre = this.nombreInput.trim();
    if (!nombre) return;
    this.zonaService.create({ nombre }).subscribe({
      next: () => {
        this.nombreInput = '';
        this.cargarZonas();
        this.onSaved.emit();
      },
      error: (err) => alert('Error: ' + JSON.stringify(err)),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta zona?')) return;
    this.zonaService.delete(id).subscribe({
      next: () => this.cargarZonas(),
      error: (err) => console.log('Error al eliminar zona', err),
    });
  }
}
