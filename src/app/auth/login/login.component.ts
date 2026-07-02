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

          localStorage.setItem(
            'token',
            resp.token
          );

          localStorage.setItem(
            'role',
            resp.data.rol.toUpperCase()
          );

          this.toastr.success('Inicio de sesion exitoso', 'Login');

            const rol = resp.data.rol?.toUpperCase();
            if (rol === 'DUENO') {
              this.router.navigate(['/dashboard']);
            } else if (rol === 'GERENTE') {
              this.router.navigate(['/dashboard-gerente']);
            } else {
              this.router.navigate(['/inventario']);
            }
        },

        error: (error) => {
          console.error(error);
          this.toastr.error('Credenciales incorrectas', 'Login');
        }
      });
  }

}
