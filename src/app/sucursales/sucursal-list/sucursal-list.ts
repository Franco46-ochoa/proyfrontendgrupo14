import { Component } from '@angular/core';
import { Sucursal } from '../sucursal.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sucursal-list',
  imports: [CommonModule],
  templateUrl: './sucursal-list.html',
  styleUrl: './sucursal-list.scss',
})
export class SucursalList {
  sucursales: Sucursal[] = [
    { id: 1, nombre: 'Sucursal Centro', direccion: 'Belgrano 123', latitud: -24.1858, longitud: -65.2995, telefono: '388-4001122', zonaId: 1 },
    { id: 2, nombre: 'Sucursal Norte', direccion: 'Av. Bolivia 456', latitud: -24.1700, longitud: -65.3100, telefono: '388-4003344', zonaId: 2 },
    { id: 3, nombre: 'Sucursal Sur', direccion: 'Ruta 9 km 4', latitud: -24.2100, longitud: -65.2900, telefono: '388-4005566', zonaId: 1 }
  ];
}
