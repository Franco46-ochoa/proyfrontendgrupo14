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
    // 1. Si es la página de login o register, NO ocultamos el layout completo.
    // Esto permite que el HTML pase al '@else if(isAuthPage())' y muestre el navbar simple de auth.
    if (this.isAuthPage()) {
      return false;
    }

    // 2. Si es el Home o la Landing pública, se limpia la pantalla.
    if (this.isPublicLanding()) {
      return true;
    }

    // 3. Si es una URL de pasarela o retorno de MercadoPago, pantalla limpia obligatoria.
    if (this.currentUrl.includes('/suscripcion') || this.currentUrl.includes('/mp/retorno')) {
      return true;
    }

    // 4. ALINEACIÓN PLAN V3: Control de roles jerárquicos de la empresa
    const rolUsuario = this.authService.getRole(); // Viene en MAYÚSCULAS desde el localStorage
    
    // Si el usuario es ADMINISTRADOR, GERENTE o EMPLEADO, operan directamente la estructura interna.
    // SIEMPRE tienen que ver el navbar y sidebar en cualquier ruta privada.
    if (rolUsuario && rolUsuario !== 'DUENO') {
      return false; // Retorna false para NO ocultar el layout y pintar Navbar + Sidebar
    }

    // 5. Si es el DUEÑO, se oculta el layout operativo SOLO si no tiene la suscripción activa.
    const tieneSuscripcionActiva = this.authService.tieneSuscripcionActiva();
    return !tieneSuscripcionActiva;
  }
}