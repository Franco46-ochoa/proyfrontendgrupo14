import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient, { optional: true }); // Listo para usar cuando se conecte al backend
  private apiUrl = '/api'; // URL base de tu backend Express

  // Método auxiliar para autenticarse automáticamente con las credenciales de seeders para desarrollo local
  private async getAuthHeaders(rol: 'dueno' | 'gerente' = 'dueno'): Promise<HeadersInit> {
    const key = `auth_token_${rol}`;
    const isBrowser = typeof window !== 'undefined';
    let token = isBrowser ? localStorage.getItem(key) : null;

    if (!token) {
      const email = rol === 'dueno' ? 'dueno@smartmargin.com' : 'gerente@smartmargin.com';
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: 'password123' })
        });
        const result = await response.json();
        if (result.success && result.token) {
          token = result.token;
          if (isBrowser) {
            localStorage.setItem(key, result.token); // Enviamos result.token que está garantizado como string
          }
        }
      } catch (e) {
        console.error('Error al iniciar sesión automáticamente:', e);
      }
    }

    return {
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    };
  }

  // Obtener sucursales reales desde el backend (Día 6 y 7)
  getSucursales(rol: 'dueno' | 'gerente' = 'dueno'): Observable<any[]> {
    // Definimos datos mockeados en caso de falla de la base de datos
    const mockSucursales = [
      { id: 1, nombre: 'SmartMargin Norte (Mock)', direccion: 'Av. San Martin 1234', lat: -24.183, lng: -65.331, telefono: '388-4123456', zonaId: 1 },
      { id: 2, nombre: 'SmartMargin Sur (Mock)', direccion: 'Calle Belgrano 567', lat: -24.195, lng: -65.3, telefono: '388-4234567', zonaId: 2 },
      { id: 3, nombre: 'SmartMargin Centro (Mock)', direccion: 'Peatonal Lavalle 890', lat: -24.185, lng: -65.31, telefono: '388-4345678', zonaId: 3 }
    ];

    // Convertimos la promesa de fetch en un Observable
    return from(
      this.getAuthHeaders(rol).then(headers => 
        fetch('/api/sucursales', { headers })
          .then(res => {
            if (!res.ok) throw new Error('Error al consultar el backend');
            return res.json();
          })
          .then(json => json.success ? json.data : [])
      )
    ).pipe(
      catchError(err => {
        console.warn('Usando sucursales de prueba local debido a:', err.message);
        // Si es gerente, filtramos localmente para cumplir con la regla de negocio
        if (rol === 'gerente') {
          return of(mockSucursales.filter(s => s.zonaId === 1));
        }
        return of(mockSucursales);
      })
    );
  }

  // 1. Obtener Datos del Dashboard del Dueño (Mock)
  getDashboardDueno(): Observable<any> {
    const mockData = {
      kpis: [
        { title: 'Venta Total', value: '$15,240', badgeText: '+12.5%', badgeColor: 'success', icon: 'bi-cart-fill' },
        { title: 'Nuevos Clientes', value: '1,245', badgeText: '+8.2%', badgeColor: 'success', icon: 'bi-people-fill' },
        { title: 'Gastos Operativos', value: '$4,120', badgeText: '-3.1%', badgeColor: 'danger', icon: 'bi-cash-coin' },
        { title: 'Órdenes Pendientes', value: '18', badgeText: 'Atención', badgeColor: 'warning', icon: 'bi-exclamation-triangle-fill' }
      ],
      barChart: {
        labels: ['Suc. Central', 'Suc. Norte', 'Suc. Sur', 'Suc. Este', 'Suc. Oeste'],
        data: [45000, 32000, 28000, 15000, 22000]
      },
      lineChart: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        data: [12000, 15000, 14000, 18000, 22000, 25000]
      }
    };
    return of(mockData).pipe(delay(500));
  }

  // 2. Obtener Datos del Dashboard del Gerente (Mock)
  getDashboardGerente(zonaId: string): Observable<any> {
    const mockData = {
      zona: 'Zona Norte',
      radarChart: {
        labels: ['Ventas', 'Gastos', 'Margen', 'Rotación Stock', 'Satisfacción Clientes'],
        sucursalA: [85, 60, 90, 70, 80],
        sucursalB: [70, 85, 65, 80, 75],
        sucursalC: [60, 50, 80, 60, 90]
      },
      pieChart: {
        labels: ['Alquileres', 'Servicios Públicos', 'Sueldos y Cargas', 'Marketing', 'Mantenimiento'],
        data: [12000, 4500, 25000, 3000, 2000]
      },
      reporteNLP: {
        texto: `La ${zonaId === 'norte' ? 'Zona Norte' : 'Zona Central'} incrementó sus ingresos un 8% esta semana. Alerta: La Sucursal B presenta posibles gastos duplicados en el rubro Alquiler.`,
        fecha: 'Hace 5 minutos'
      }
    };
    return of(mockData).pipe(delay(500));
  }

  // 3. Cotización del Dólar (Día 9 del backend/API real)
  getCotizacionDolar(): Observable<any> {
    return of({ compra: '1220.00', venta: '1250.00', fecha: new Date() });
  }
}
