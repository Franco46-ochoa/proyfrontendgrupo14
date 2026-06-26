import { Component } from '@angular/core';
import { SucursalForm } from './sucursales/sucursal-form/sucursal-form';
import { SucursalList } from './sucursales/sucursal-list/sucursal-list';

@Component({
  selector: 'app-root',
  imports: [SucursalList, SucursalForm],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyfrontendgrupo14';
}
