import { Component, inject, OnInit, NgZone } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private ngZone = inject(NgZone);

  protected environment = environment;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadGoogleScript();
    (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
  }

  private loadGoogleScript(): void {
    if (document.getElementById('google-gsi-script')) return;
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  handleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      this.authService.googleAuth({ token: response.credential }).subscribe({
        next: (resp: any) => {
          const token = resp.token;
          const rol = resp.data?.rol?.toUpperCase();
          const depto = resp.data?.departamento?.toUpperCase();

          const roleKey = (rol === 'EMPLEADO' && depto) ? `EMP_${depto}` : rol;

          this.authService.saveSession(token, roleKey);
          this.toastr.success('Inicio de sesión con Google exitoso', 'Login');

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
          const msg = error?.error?.message || 'Error al autenticar con Google';
          this.toastr.error(msg, 'Login Google');
        }
      });
    });
  }

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
