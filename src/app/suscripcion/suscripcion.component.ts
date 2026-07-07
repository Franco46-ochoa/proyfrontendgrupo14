import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SuscripcionService } from '../core/services/suscripcion.service';

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule, FormsModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.scss'
})
export class SuscripcionComponent implements OnInit {

  private router = inject(Router);
  private suscripcionService = inject(SuscripcionService);

constructor(private toastr: ToastrService) {}

estado: 'planes' | 'formulario' | 'activa' = 'planes';
planSeleccionado: any = null;
planActual: any = null;

  datos = {
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    this.suscripcionService.obtener().subscribe({
      next: (data: any) => {
        if (data && data.estado === 'activo') {
          this.planActual = {
            ...data,
            proximoPago: data.fechaPago
              ? new Date(new Date(data.fechaPago).setMonth(new Date(data.fechaPago).getMonth() + 1)).toLocaleDateString()
              : '—',
            fechaVencimiento: data.fechaPago
              ? new Date(new Date(data.fechaPago).setMonth(new Date(data.fechaPago).getMonth() + 1)).toLocaleDateString()
              : '—'
          };
          this.planSeleccionado = {
            ...this.planes.find(p => p.id === data.plan),
            precio: data.monto
          };
          this.estado = 'activa';
        }
      }
    });
  }

  // Listado de planes disponibles
  planes = [
    {
      id: 'basico',
      nombre: 'Básico',
      precio: 1000,
      sucursales: '3 sucursales',
      caracteristicas: [
        'Hasta 3 sucursales',
        'Reportes IA básicos',
        'Soporte estándar por email'
      ]
    },
    {
      id: 'pro',
      nombre: 'PRO',
      precio: 2500,
      sucursales: '10 sucursales',
      caracteristicas: [
        'Hasta 10 sucursales',
        'Reportes IA ilimitados',
        'Soporte prioritario 24/7',
        'Exportación PDF/Excel'
      ]
    },
    {
      id: 'enterprise',
      nombre: 'Enterprise',
      precio: 5000,
      sucursales: 'Ilimitado',
      caracteristicas: [
        'Sucursales ilimitadas',
        'Reportes IA avanzados',
        'Soporte dedicado por canal privado',
        'Auditoría completa'
      ]
    }
  ];


seleccionarPlan(plan: any): void {
  this.planSeleccionado = plan;
  this.estado = 'formulario';

  this.toastr.info(
    `Seleccionaste el plan ${plan.nombre}`,
    'Plan Seleccionado'
  );
}

  simularPago(): void {

    if (
      !this.datos.nombre ||
      !this.datos.apellido ||
      !this.datos.email ||
      !this.datos.dni
    ) {

      this.toastr.warning(
        'Completa todos los campos requeridos',
        'Formulario incompleto'
      );

      return;
    }

    this.toastr.info('Redirigiendo a Mercado Pago...', 'Mercado Pago');

    const token = localStorage.getItem('token');
    let payer_email = this.datos.email;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        payer_email = payload.email || this.datos.email;
      } catch (_e) {}
    }

    this.suscripcionService.crearPreferenciaMP({
      plan: this.planSeleccionado.id,
      monto: this.planSeleccionado.precio,
      payer_email
    }).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('mp_plan', JSON.stringify({
          plan: this.planSeleccionado.id,
          monto: this.planSeleccionado.precio
        }));
        window.location.href = res.init_point;
      },
      error: (err) => {
        console.error('Error al crear preferencia MP', err);
        this.toastr.error(
          'Error al conectar con Mercado Pago. Intentá de nuevo.',
          'Error'
        );
      }
    });
  }

  volverAPlanes(): void {

    this.estado = 'planes';

    this.planSeleccionado = null;
  }

  cancelarSuscripcion(): void {

    this.planActual = null;

    this.planSeleccionado = null;

    this.estado = 'planes';

    this.toastr.error(
      'La suscripción fue cancelada',
      'Suscripción'
    );
  }


}
