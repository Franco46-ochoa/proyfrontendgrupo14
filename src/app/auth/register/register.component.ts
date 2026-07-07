import { Component, inject, OnInit, NgZone } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private ngZone = inject(NgZone);

  protected environment = environment;
  errorCodigo = '';

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['empleado', Validators.required],
    codigoInvitacion: [''],
    departamento: ['']
  });

  ngOnInit(): void {
    this.loadGoogleScript();
  }

  private loadGoogleScript(): void {
    if (document.getElementById('google-gsi-script')) {
      this.initializeGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleButton();
    document.head.appendChild(script);
  }

  private initializeGoogleButton(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: this.environment.googleClientId,
        callback: this.handleRegisterResponse.bind(this),
        context: 'signup',
      });

      const buttonDiv = document.getElementById('google-register-btn-container');
      if (buttonDiv) {
        google.accounts.id.renderButton(buttonDiv, {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          text: 'signup_with',
          size: 'large',
          logo_alignment: 'left',
        });
      }
    }
  }

  handleRegisterResponse(response: any): void {
    this.ngZone.run(() => {
      this.errorCodigo = '';
      const rolSeleccionado = this.registerForm.value.rol;
      const codigo = this.registerForm.value.codigoInvitacion;

      if (rolSeleccionado !== 'dueno' && !codigo) {
        this.errorCodigo = 'Código de invitación requerido para gerentes y empleados';
        this.toastr.error(this.errorCodigo, 'Registro');
        return;
      }

      const body: any = { token: response.credential };

      if (rolSeleccionado !== 'dueno') {
        body.codigoInvitacion = codigo;
      }

      this.authService.googleAuth(body).subscribe({
        next: (resp: any) => {
          this.toastr.success('Usuario registrado exitosamente con Google', 'Registro');

          const token = resp.token;
          const rol = resp.data?.rol?.toUpperCase();
          const depto = resp.data?.departamento?.toUpperCase();
          const roleKey = (rol === 'EMPLEADO' && depto) ? `EMP_${depto}` : rol;

          this.authService.saveSession(token, roleKey);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const msg = error?.error?.message || 'Error al registrar con Google';
          this.errorCodigo = msg;
          this.toastr.error(msg, 'Registro Google');
        }
      });
    });
  }

  onSubmit() {
    this.errorCodigo = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const body: any = {
      nombre: this.registerForm.value.nombre,
      apellido: this.registerForm.value.apellido,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      rol: this.registerForm.value.rol,
      departamento: this.registerForm.value.departamento,
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
