import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent implements OnInit {

  productoForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      codigo: ['', Validators.required],
      categoria: ['', Validators.required],
      precioCompra: ['', [Validators.required, Validators.min(0)]],
      unidadMedida: ['', Validators.required]
    });
  }

  guardar() {
    if (this.productoForm.valid) {
      console.log('Datos del producto a guardar:', this.productoForm.value);
    } else {
      this.productoForm.markAllAsTouched();
    }
  }
}
