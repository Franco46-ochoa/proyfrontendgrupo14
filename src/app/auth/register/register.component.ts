import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);

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
        this.toastr.success('Usuario registrado exitosamente', 'Registro');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const msg = error?.error?.message || '';
        if (msg) {
          this.errorCodigo = msg;
          this.toastr.error(msg, 'Registro');
        } else {
          this.errorCodigo = 'Error al registrar. Revisá que el backend esté corriendo.';
          this.toastr.error(
            'Error al registrar. Revisa que el backend este corriendo.',
            'Registro'
          );
        }
      }
    });
  }
}
