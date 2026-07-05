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

          //
        const rol = resp.data.rol?.toUpperCase();
        const subRol = resp.data.subRol?.toUpperCase(); 
        const isFirstLogin = resp.data.firstLogin; // <- backend futuro

          this.toastr.success('Inicio de sesion exitoso', 'Login');

          //para primer login y redireccionar a suscripcion si es dueño
          //corregir esto cuando el backend tenga la propiedad 
          if (rol == 'DUENO' && isFirstLogin){
            this.router.navigate(['/suscripcion']);
            return;
          }

          //corregir esto cuando el backend tenga la propiedad administrador, comercial y operativo
          if (rol == 'DUENO' || rol == 'ADMINISTRADOR'){
            this.router.navigate(['/dashboard']);
            return;
          }

          if(rol == 'GERENTE'){
            this.router.navigate(['/dashboard-gerente']);
            return;
          }

          if(rol == 'EMPLEADO'){
            if (subRol == 'COMERCIAL' || subRol == 'OPERATIVO'){
              this.router.navigate(['/inventario']);
              return;
            }

            this.router.navigate(['/empleado']);
            return;
          }
        },

        error: (error) => {
          console.error(error);
          this.toastr.error('Credenciales incorrectas', 'Login');
        }
      });
  }

  loginGoogle() {
  this.toastr.info(
    'Google OAuth en desarrollo',
    'Próximamente'
  );
}

}
