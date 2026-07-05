import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GastoService } from '../../core/services/gasto.service';
import { SucursalService } from '../../core/services/sucursal.service';
import { ProveedorService } from '../../core/services/proveedor.service';
import { Sucursal } from '../../sucursales/sucursal.model';
import { Proveedor } from '../../shared/models/proveedor.model';

@Component({
  selector: 'app-gasto-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './gasto-form.component.html',
  styleUrl: './gasto-form.component.scss'
})
export class GastoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private gastoService = inject(GastoService);
  private sucursalService = inject(SucursalService);
  private proveedorService = inject(ProveedorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  gastoForm!: FormGroup;
  editId: number | null = null;
  esEdicion = false;
  sucursales: Sucursal[] = [];
  proveedores: Proveedor[] = [];

  ngOnInit(): void {
    this.gastoForm = this.fb.group({
      tipo: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      fecha: ['', Validators.required],
      proveedorId: [''],
      sucursalId: ['', Validators.required]
    });

    this.sucursalService.getAll().subscribe(data => this.sucursales = data);
    this.proveedorService.getAll().subscribe(data => this.proveedores = data);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = Number(idParam);
      this.esEdicion = true;
      this.gastoService.getById(this.editId).subscribe({
        next: (g) => this.gastoForm.patchValue({ ...g, fecha: g.fecha?.substring(0, 10) || '' })
      });
    }
  }

  guardar(): void {
    if (this.gastoForm.valid) {
      const v = { ...this.gastoForm.value };
      if (!v.proveedorId) delete v.proveedorId;
      const req = this.esEdicion && this.editId
        ? this.gastoService.update(this.editId, v)
        : this.gastoService.create(v);
      req.subscribe({ next: () => this.router.navigate(['/gastos']) });
    } else {
      this.gastoForm.markAllAsTouched();
    }
  }
}
