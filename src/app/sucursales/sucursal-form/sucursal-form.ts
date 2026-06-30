import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sucursal-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sucursal-form.html',
  styleUrl: './sucursal-form.scss',
})
export class SucursalForm implements OnInit {
  sucursalForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.sucursalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      zonaId: [''],
      gerentesMax: [1, [Validators.required, Validators.min(1)]],
      empleadosMax: [10, [Validators.required, Validators.min(1)]]
    });
  }

  guardar() {
    if (this.sucursalForm.valid) {
      console.log('Formulario válido, datos:', this.sucursalForm.value);
    } else {
      this.sucursalForm.markAllAsTouched();
    }
  }
}
