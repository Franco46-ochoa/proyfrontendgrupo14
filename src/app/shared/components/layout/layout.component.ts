import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';
// Salimos 3 niveles (layout -> components -> shared -> app) para entrar correctamente a core
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  sidebarVisible = true;
  currentUrl = '';

  // Inyectamos correctamente los servicios usando la función inject de Angular
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  isAuthPage(): boolean {
    return (
      this.currentUrl === '/login' ||
      this.currentUrl === '/register'
    );
  }

  isPublicLanding(): boolean {
    return this.currentUrl === '/home' || this.currentUrl === '/' || this.currentUrl === '';
  }

  debeOcultarLayoutCompleto(): boolean {
    // 1. Si está en Login o Register, NO se oculta el layout general (usa su navbar simple de auth)
    if (this.isAuthPage()) {
      return false;
    }

    // 2. Si es la landing o página de inicio pública, pantalla limpia
    if (this.isPublicLanding()) {
      return true;
    }

    // 3. OBTENER VARIABLES DEL USUARIO (Alineación Plan V3)
    const rolUsuario = this.authService.getRole(); // Viene en MAYÚSCULAS ('ADMINISTRADOR', 'DUENO')
    const tieneSuscripcionActiva = this.authService.tieneSuscripcionActiva();

    // 4. CONTROL PARA ROLES OPERATIVOS (Admin, Gerente, Empleado)
    // Ellos nunca pagan suscripción corporativa, entran directo con Navbar y Sidebar
    if (rolUsuario && rolUsuario !== 'DUENO') {
      return false; // Retorna false para NO ocultar el layout
    }

    // 5. CONTROL PARA EL DUEÑO SUSCRITO
    // Si el dueño YA PAGÓ, no se le oculta el layout bajo ningún concepto. Ve su panel operativo.
    if (rolUsuario === 'DUENO' && tieneSuscripcionActiva) {
      return false; 
    }

    // 6. CONTROL PARA EL DUEÑO NO SUSCRITO (Pasarela aislada)
    // Si está pagando o volviendo de MercadoPago, pantalla limpia obligatoria
    if (this.currentUrl.includes('/suscripcion') || this.currentUrl.includes('/mp/retorno')) {
      return true;
    }

    // Por defecto para dueños que caigan en rutas sin pagar: ocultar layout
    return !tieneSuscripcionActiva;
  }
}