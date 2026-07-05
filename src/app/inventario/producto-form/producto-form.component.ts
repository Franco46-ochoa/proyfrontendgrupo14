import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../core/services/producto.service';

@Component({
  selector: 'app-producto-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productoForm!: FormGroup;
  guardando = false;
  cargando = false;
  error = '';
  editando = false;
  productoId?: number;

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      categoria: ['', Validators.required],
      precioCompra: ['', [Validators.required, Validators.min(0.01)]],
      unidadMedida: ['unidad', Validators.required]
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editando = true;
      this.productoId = id;
      this.cargarProducto(id);
    }
  }

  cargarProducto(id: number): void {
    this.cargando = true;
    this.error = '';

    this.productoService.getById(id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue({
          nombre: producto.nombre,
          codigo: producto.codigo,
          categoria: producto.categoria ?? '',
          precioCompra: Number(producto.precioCompra),
          unidadMedida: producto.unidadMedida
        });
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudo cargar el producto';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = '';

    const { nombre, codigo, categoria, precioCompra, unidadMedida } = this.productoForm.value;
    const payload = {
      nombre: nombre.trim(),
      codigo: codigo.trim(),
      categoria,
      precioCompra: Number(precioCompra),
      unidadMedida: unidadMedida.trim()
    };

    const request$ = this.editando && this.productoId
      ? this.productoService.update(this.productoId, payload)
      : this.productoService.create(payload);

    request$.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = err.error?.message || (this.editando
          ? 'Error al actualizar el producto'
          : 'Error al crear el producto');
      }
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.productoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
