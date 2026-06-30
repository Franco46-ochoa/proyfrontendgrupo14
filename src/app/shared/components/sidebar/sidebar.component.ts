import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true
})
export class SidebarComponent implements OnInit {
  rol = '';

  ngOnInit() {
    this.rol = (localStorage.getItem('role') || '').toLowerCase();
  }

  esDueno() { return this.rol === 'dueno'; }
  esGerente() { return this.rol === 'gerente'; }
  esEmpleado() { return this.rol === 'empleado'; }
}
