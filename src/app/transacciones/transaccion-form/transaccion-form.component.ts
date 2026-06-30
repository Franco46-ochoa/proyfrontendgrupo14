import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaccion-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transaccion-form.component.html',
  styleUrl: './transaccion-form.component.scss'
})  
  export class TransaccionFormComponent implements OnInit {
    transaccionForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.transaccionForm = this.fb.group({
      tipo: ['Venta', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      total: [{value: 0, disabled: true}] // El total se calcula solo, el usuario no lo edita
    });

    // Suscripción a cambios para calcular total automáticamente
    this.transaccionForm.valueChanges.subscribe(valores => {
      const cant = valores.cantidad || 0;
      const precio = valores.precioUnitario || 0;
      this.transaccionForm.patchValue({ total: cant * precio }, { emitEvent: false });
    });
  }

  guardar() {
    if (this.transaccionForm.valid) {
      console.log('Transacción guardada:', this.transaccionForm.getRawValue());
    }
  }
}
