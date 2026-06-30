import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.scss'
})
export class SuscripcionComponent {
   // Plan actual simulado
  planActual = {
    id: 'pro',
    nombre: 'PRO',
    precio: 2500,
    estado: 'ACTIVO',
    proximoPago: '12/07/2026',
    sucursales: '10 sucursales',
    caracteristicas: [
      'Hasta 10 sucursales',
      'Reportes IA ilimitados',
      'Soporte prioritario 24/7',
      'Exportación PDF/Excel'
    ]
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

  cambiarPlan(planId: string): void {
    alert(`Redirigiendo a Checkout de MercadoPago para cambiar al plan: ${planId.toUpperCase()}`);
  }

  cancelarSuscripcion(): void {
    const confirmar = confirm('¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a los reportes IA.');
    if (confirmar) {
      alert('Suscripción cancelada.');
    }
  }

  

}
