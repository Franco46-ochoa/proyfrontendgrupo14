import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (resp: any) => {
          const token = resp.token;
          const rol = resp.data?.rol?.toUpperCase();
          const depto = resp.data?.departamento?.toUpperCase();

          const roleKey = (rol === 'EMPLEADO' && depto) ? `EMP_${depto}` : rol;

          this.authService.saveSession(token, roleKey);

          this.toastr.success('Inicio de sesion exitoso', 'Login');

          switch (roleKey) {
            case 'DUENO':
              if (this.authService.tieneSuscripcionActiva()) {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/suscripcion']);
              }
              break;

            case 'ADMINISTRADOR':
              this.router.navigate(['/dashboard']);
              break;

            case 'GERENTE':
              this.router.navigate(['/dashboard']);
              break;

            case 'EMP_COMERCIAL':
              this.router.navigate(['/transacciones']);
              break;

            case 'EMP_OPERATIVO':
              this.router.navigate(['/inventario']);
              break;

            default:
              this.router.navigate(['/home']);
              break;
          }
        },

        error: (error) => {
          console.error(error);
          this.toastr.error('Credenciales incorrectas', 'Login');
        }
      });
  }

}
