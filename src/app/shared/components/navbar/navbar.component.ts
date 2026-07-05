import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent {

  @Output() menuClick = new EventEmitter<void>();

  private router = inject(Router);

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

}