import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransaccionService } from '../../core/services/transaccion.service';
import { ProductoService } from '../../core/services/producto.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { Producto } from '../../inventario/producto.model';
import { Sucursal } from '../../sucursales/sucursal.model';

@Component({
  selector: 'app-transaccion-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaccion-form.component.html',
  styleUrl: './transaccion-form.component.scss'
})  
  export class TransaccionFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private transaccionService = inject(TransaccionService);
    private productoService = inject(ProductoService);
    private sucursalService = inject(SucursalService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    transaccionForm!: FormGroup;
    editId: number | null = null;
    esEdicion = false;
    productos: Producto[] = [];
    sucursales: Sucursal[] = [];

  ngOnInit(): void {
    this.transaccionForm = this.fb.group({
      tipo: ['venta', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      productoId: [null, Validators.required],
      sucursalId: [null, Validators.required],
      fecha: [new Date().toISOString().split('T')[0]],
      observaciones: ['']
    });

    this.productoService.getAll().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos', err)
    });
    this.sucursalService.getAll().subscribe({
      next: (data) => this.sucursales = data,
      error: (err) => console.error('Error al cargar sucursales', err)
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = Number(idParam);
      this.esEdicion = true;
      this.transaccionService.getById(this.editId).subscribe({
        next: (t) => {
          const fechaStr = t.fecha ? t.fecha.split('T')[0] : '';
          this.transaccionForm.patchValue({
            tipo: t.tipo,
            cantidad: t.cantidad,
            precioUnitario: t.precioUnitario,
            productoId: t.productoId,
            sucursalId: t.sucursalId,
            fecha: fechaStr,
            observaciones: t.observaciones || ''
          });
        },
        error: (err) => console.error('Error al cargar transacción', err)
      });
    }
  }

  guardar(): void {
    if (this.transaccionForm.valid) {
      const formValue = this.transaccionForm.value;
      const payload = {
        tipo: formValue.tipo,
        cantidad: formValue.cantidad,
        precioUnitario: formValue.precioUnitario,
        productoId: formValue.productoId,
        sucursalId: formValue.sucursalId,
        fecha: formValue.fecha ? new Date(formValue.fecha).toISOString() : undefined,
        observaciones: formValue.observaciones || undefined
      };

      const request = this.esEdicion && this.editId
        ? this.transaccionService.update(this.editId, payload)
        : this.transaccionService.create(payload);

      request.subscribe({
        next: () => this.router.navigate(['/transacciones']),
        error: (err) => console.error('Error al guardar transacción', err)
      });
    }
  }
}
