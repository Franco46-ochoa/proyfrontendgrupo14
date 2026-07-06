import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SucursalService } from '../../core/services/sucursal.service';
import { ZonaService } from '../../core/services/zona.service';
import { Zona } from '../../shared/models/zona.model';

@Component({
  selector: 'app-sucursal-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sucursal-form.html',
  styleUrl: './sucursal-form.scss',
})
export class SucursalForm implements OnInit {
  private fb = inject(FormBuilder);
  private sucursalService = inject(SucursalService);
  private zonaService = inject(ZonaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  sucursalForm!: FormGroup;
  editId: number | null = null;
  esEdicion = false;
  zonas: Zona[] = [];
  errorMsg = '';

  ngOnInit(): void {
    this.sucursalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      zonaId: [null, Validators.required],
      gerentesMax: [1, [Validators.required, Validators.min(1)]],
      empleadosMax: [10, [Validators.required, Validators.min(1)]]
    });

    this.zonaService.getAll().subscribe({
      next: (data) => this.zonas = data,
      error: () => this.errorMsg = 'Error al cargar zonas'
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editId = Number(idParam);
      this.esEdicion = true;
      this.sucursalService.getById(this.editId).subscribe({
        next: (s) => {
          this.sucursalForm.patchValue({
            nombre: s.nombre,
            direccion: s.direccion,
            telefono: s.telefono,
            lat: s.lat,
            lng: s.lng,
            zonaId: s.zonaId,
          });
        },
        error: () => this.errorMsg = 'Error al cargar sucursal'
      });
    }
  }

  guardar(): void {
    this.errorMsg = '';
    if (this.sucursalForm.valid) {
      const formValue = this.sucursalForm.value;
      const payload: any = {
        nombre: formValue.nombre,
        direccion: formValue.direccion,
        telefono: formValue.telefono,
        lat: formValue.lat,
        lng: formValue.lng,
        zonaId: formValue.zonaId,
      };

      if (!this.esEdicion) {
        payload.gerentesMax = formValue.gerentesMax;
        payload.empleadosMax = formValue.empleadosMax;
      }

      const request = this.esEdicion && this.editId
        ? this.sucursalService.update(this.editId, payload)
        : this.sucursalService.create(payload);

      request.subscribe({
        next: () => this.router.navigate(['/sucursales']),
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error?.message || 'Error al guardar sucursal';
        }
      });
    } else {
      this.sucursalForm.markAllAsTouched();
    }
  }
}
