import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../core/services/proveedor.service';

@Component({
  selector: 'app-proveedor-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './proveedor-form.component.html',
  styleUrl: './proveedor-form.component.scss'
})
export class ProveedorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private proveedorService = inject(ProveedorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  proveedorForm!: FormGroup;
  editId: number | null = null;
  esEdicion = false;

  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      cuit: ['', [Validators.required, Validators.maxLength(20)]],
      contacto: ['', Validators.maxLength(100)],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = Number(idParam);
      this.esEdicion = true;
      this.proveedorService.getById(this.editId).subscribe({
        next: (p) => this.proveedorForm.patchValue(p)
      });
    }
  }

  guardar(): void {
    if (this.proveedorForm.valid) {
      const v = this.proveedorForm.value;
      const req = this.esEdicion && this.editId
        ? this.proveedorService.update(this.editId, v)
        : this.proveedorService.create(v);
      req.subscribe({ next: () => this.router.navigate(['/proveedores']) });
    } else {
      this.proveedorForm.markAllAsTouched();
    }
  }
}
