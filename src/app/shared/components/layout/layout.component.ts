import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true
})
export class LayoutComponent {
  sidebarVisible = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

}
