import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule, FormsModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.scss'
})
export class SuscripcionComponent {

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

  tarjeta = {
    numero: '',
    titular: '',
    vencimiento: '',
    cvv: ''
  };

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
      !this.datos.dni ||
      !this.tarjeta.numero ||
      !this.tarjeta.cvv
    ) {

      this.toastr.warning(
        'Completa todos los campos requeridos',
        'Formulario incompleto'
      );

      return;
    }

    this.toastr.info(
      'Procesando pago...',
      'Mercado Pago'
    );

    setTimeout(() => {

      this.planActual = {
      ...this.planSeleccionado,
      estado: 'ACTIVA',
      fechaInicio: '05/07/2026',
      proximoPago: '05/08/2026',
      fechaVencimiento: '05/08/2026'
      };

      this.estado = 'activa';

      this.toastr.success(
        'La suscripción fue activada correctamente',
        'Pago aprobado'
      );

    }, 2500);
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
