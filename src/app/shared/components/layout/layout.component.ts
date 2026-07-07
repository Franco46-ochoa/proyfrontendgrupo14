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

  // Controla qué vistas se renderizan a pantalla completa (sin Navbar ni Sidebar)
  debeOcultarLayoutCompleto(): boolean {
    // Si el usuario está en el Home o Landing pública, se oculta el menú privado
    if (this.isPublicLanding()) {
      return true;
    }

    // Si NO tiene una suscripción activa en el sistema, ocultamos el layout principal.
    // Esto mantendrá la pantalla limpia tanto en /suscripcion como en /mp/retorno
    const tieneSuscripcionActiva = this.authService.tieneSuscripcionActiva();
    return !tieneSuscripcionActiva;
  }
}