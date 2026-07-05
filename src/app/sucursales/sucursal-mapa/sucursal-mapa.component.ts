import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
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
  private markersGroup!: L.FeatureGroup;
  private _sucursales: any[] = [];

  @Input()
  set sucursales(value: any[]) {
    this._sucursales = value || [];
    if (this.map) {
      this.updateMarkers();
    }
  }

  get sucursales(): any[] {
    return this._sucursales;
  }

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

    // Inicializar el grupo de marcadores y agregarlo al mapa
    this.markersGroup = L.featureGroup().addTo(this.map);

    // Dibujar marcadores existentes
    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map || !this.markersGroup) return;

    // Limpiar marcadores anteriores
    this.markersGroup.clearLayers();

    // Dibujar nuevos marcadores
    this.sucursales.forEach(suc => {
      // Intentamos leer coordenadas de base de datos (lat y lng)
      const lat = parseFloat(suc.lat);
      const lng = parseFloat(suc.lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng]);
        marker.bindPopup(`
          <strong>${suc.nombre}</strong><br>
          Dirección: ${suc.direccion || 'Sin dirección'}<br>
          Teléfono: ${suc.telefono || 'Sin teléfono'}<br>
          Zona ID: ${suc.zonaId || 'N/A'}
        `);
        this.markersGroup.addLayer(marker);
      }
    });

    // Ajustar mapa automáticamente para encajar todos los marcadores visibles
    if (this.sucursales.length > 0) {
      const bounds = this.markersGroup.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  ngOnDestroy(): void {
    // Liberar memoria destruyendo el mapa
    if (this.map) {
      this.map.remove();
    }
  }
}
