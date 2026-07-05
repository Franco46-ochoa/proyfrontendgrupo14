import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import {NavigationEnd, Router, RouterOutlet, RouterLink} from "@angular/router";
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, SidebarComponent, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true
})
export class LayoutComponent {
  sidebarVisible = true;

  currentUrl = '';

  constructor(private router: Router) {

  this.currentUrl = this.router.url;

  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe((event: any) => {
      this.currentUrl = event.url;
    });

}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  isAuthPage(): boolean {
    return this.currentUrl === '/login'
        || this.currentUrl === '/register'
        || this.currentUrl === '/home'
        || this.currentUrl === '/';
  }

  isPublicLanding(): boolean {
    return this.currentUrl === '/home' || this.currentUrl === '/';
  }

}
