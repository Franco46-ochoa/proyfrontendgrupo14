import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-sucursal-mapa',
  imports: [CommonModule],
  templateUrl: './sucursal-mapa.component.html',
  styleUrl: './sucursal-mapa.component.scss'
})
export class SucursalMapaComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // 1. Solución de íconos rotos por empaquetado de assets de Angular
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
    L.Marker.prototype.options.icon = defaultIcon;

    // 2. Inicializar el mapa centrado en coordenadas dummy (ej. San Salvador de Jujuy)
    this.map = L.map('map', {
      center: [-24.1858, -65.2995],
      zoom: 13
    });

    // 3. Agregar capa base (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // 4. Agregar marcadores dummy para sucursales
    const sucursalCentral = L.marker([-24.1858, -65.2995]).addTo(this.map);
    sucursalCentral.bindPopup(`
      <strong>Sucursal Central</strong><br>
      Dirección: Belgrano 1234<br>
      Estado de Stock: Ok
    `);

    const sucursalNorte = L.marker([-24.1750, -65.3120]).addTo(this.map);
    sucursalNorte.bindPopup(`
      <strong>Sucursal Norte</strong><br>
      Dirección: Av. Italia 567<br>
      Estado de Stock: 3 productos en alerta ⚠
    `);
  }

  ngOnDestroy(): void {
    // Liberar memoria destruyendo el mapa
    if (this.map) {
      this.map.remove();
    }
  }
}
