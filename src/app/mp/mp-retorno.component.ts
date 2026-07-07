import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SuscripcionService } from '../core/services/suscripcion.service';

@Component({
  selector: 'app-mp-retorno',
  imports: [CommonModule, RouterModule],
  templateUrl: './mp-retorno.component.html',
  styleUrls: ['./mp-retorno.component.scss']
})
export class MpRetornoComponent implements OnInit {
  estado: 'cargando' | 'exito' | 'error' = 'cargando';
  mensaje = 'Procesando tu pago...';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private suscripcionService = inject(SuscripcionService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const status = params['status'];

      if (status === 'authorized') {
        const saved = sessionStorage.getItem('mp_plan');
        if (saved) {
          try {
            const { plan, monto } = JSON.parse(saved);
            this.suscripcionService.crear({ plan, monto }).subscribe({
              next: () => {
                this.estado = 'exito';
                this.mensaje = 'Pago confirmado. Redirigiendo...';
                sessionStorage.removeItem('mp_plan');
                setTimeout(() => this.router.navigate(['/dashboard']), 2000);
              },
              error: () => {
                this.estado = 'error';
                this.mensaje = 'Error al activar tu suscripción. Contactá a soporte.';
              }
            });
          } catch {
            this.estado = 'error';
            this.mensaje = 'Error al procesar el pago.';
          }
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else if (status === 'pending') {
        this.estado = 'cargando';
        this.mensaje = 'Pago pendiente. Te redirigiremos cuando se confirme.';
      } else {
        this.estado = 'error';
        this.mensaje = 'El pago fue rechazado o cancelado.';
      }
    });
  }
}
