import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorCodigo = '';

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['empleado', Validators.required],
    codigoInvitacion: ['']
  });

  onSubmit() {
    this.errorCodigo = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const body: any = {
      nombre: this.registerForm.value.nombre,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      rol: this.registerForm.value.rol,
    };

    if (this.registerForm.value.rol !== 'dueno') {
      body.codigoInvitacion = this.registerForm.value.codigoInvitacion;
    }

    this.authService.register(body).subscribe({
      next: () => {
        alert('Usuario registrado');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const msg = error?.error?.message || '';
        if (msg.includes('Código') || msg.includes('código')) {
          this.errorCodigo = msg;
        } else {
          console.error(error);
          alert('Error al registrar');
        }
      }
    });
  }
}
