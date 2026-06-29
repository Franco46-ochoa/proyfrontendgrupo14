import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gasto-form.component.html',
  styleUrl: './gasto-form.component.scss'
})
export class GastoFormComponent implements OnInit {
  gastoForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.gastoForm = this.fb.group({
      tipo: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      fecha: ['', Validators.required],
      proveedorId: [''],
      sucursalId: ['', Validators.required]
    });
  }

  guardar() {
    if (this.gastoForm.valid) {
      console.log('Gasto a registrar:', this.gastoForm.value);
    } else {
      this.gastoForm.markAllAsTouched();
    }
  }
}
