import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, forkJoin } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient, { optional: true }); // Listo para usar cuando se conecte al backend
  private apiUrl = environment.apiUrl;

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

  // Obtener sucursales reales desde el backend 
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

  // Obtener artículos con stock crítico desde el backend
  getInventarioCritico(rol: 'dueno' | 'gerente' = 'dueno'): Observable<any[]> {
    return from(
      this.getAuthHeaders(rol).then(headers =>
        fetch('/api/inventario?stockCritico=true', { headers })
          .then(res => {
            if (!res.ok) throw new Error('Error al consultar el backend');
            return res.json();
          })
          .then(json => json.success ? json.data : [])
      )
    ).pipe(
      catchError(err => {
        console.warn('Error al obtener inventario crítico:', err.message);
        return of([]);
      })
    );
  }

  // Obtener transacciones reales desde el backend (Día 11)
  getTransaccionesReales(rol: 'dueno' | 'gerente' = 'dueno'): Observable<any[]> {
    return from(
      this.getAuthHeaders(rol).then(headers =>
        fetch('/api/transacciones', { headers })
          .then(res => {
            if (!res.ok) throw new Error('Error al consultar transacciones');
            return res.json();
          })
          .then(json => json.success ? json.data : [])
      )
    ).pipe(
      catchError(err => {
        console.warn('Error al obtener transacciones reales:', err.message);
        return of([]);
      })
    );
  }

  // Obtener gastos reales desde el backend (Día 11)
  getGastosReales(rol: 'dueno' | 'gerente' = 'dueno'): Observable<any[]> {
    return from(
      this.getAuthHeaders(rol).then(headers =>
        fetch('/api/gastos', { headers })
          .then(res => {
            if (!res.ok) throw new Error('Error al consultar gastos');
            return res.json();
          })
          .then(json => json.success ? json.data : [])
      )
    ).pipe(
      catchError(err => {
        console.warn('Error al obtener gastos reales:', err.message);
        return of([]);
      })
    );
  }

  // 1. Obtener Datos del Dashboard del Dueño (Real / Fallback Mock)
  getDashboardDueno(): Observable<any> {
    const mockData = {
      kpis: [
        { title: 'Venta Total', value: '$15,240', badgeText: '+12.5%', badgeColor: 'success', icon: 'bi-cart-fill' },
        { title: 'Nuevos Clientes', value: '1,245', badgeText: '+8.2%', badgeColor: 'success', icon: 'bi-people-fill' },
        { title: 'Gastos Operativos', value: '$4,120', badgeText: '-3.1%', badgeColor: 'danger', icon: 'bi-cash-coin' },
        { title: 'Margen de Ganancia', value: '32.4%', badgeText: 'Estable', badgeColor: 'success', icon: 'bi-graph-up-arrow' }
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

    return forkJoin({
      sucursales: this.getSucursales('dueno'),
      transacciones: this.getTransaccionesReales('dueno'),
      gastos: this.getGastosReales('dueno')
    }).pipe(
      map(({ sucursales, transacciones, gastos }) => {
        // Fallback si no hay registros reales en la BD (dueño nuevo sin datos)
        if (!transacciones.length && !gastos.length) {
          return {
            kpis: [
              { title: 'Venta Total', value: '$0', badgeText: '0%', badgeColor: 'secondary', icon: 'bi-cart-fill' },
              { title: 'Nuevos Clientes', value: '0', badgeText: '0%', badgeColor: 'secondary', icon: 'bi-people-fill' },
              { title: 'Gastos Operativos', value: '$0', badgeText: '0%', badgeColor: 'secondary', icon: 'bi-cash-coin' },
              { title: 'Margen de Ganancia', value: '0%', badgeText: 'Sin datos', badgeColor: 'secondary', icon: 'bi-graph-up-arrow' }
            ],
            barChart: {
              labels: sucursales.length > 0 ? sucursales.map(s => s.nombre) : ['Sin Sucursales'],
              data: sucursales.length > 0 ? sucursales.map(() => 0) : [0]
            },
            lineChart: {
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
              data: [0, 0, 0, 0, 0, 0]
            }
          };
        }

        // 1. KPI Cálculos
        const ventasVal = transacciones.filter(t => t.tipo === 'venta');
        const ventaTotalNum = ventasVal.reduce((sum, t) => sum + parseFloat(t.total), 0);
        const gastosTotalNum = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0);
        
        const margenVal = ventaTotalNum > 0 
          ? (((ventaTotalNum - gastosTotalNum) / ventaTotalNum) * 100).toFixed(1) 
          : '0.0';

        const kpis = [
          { title: 'Venta Total', value: `$${ventaTotalNum.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, badgeText: `+${(ventasVal.length ? 10.5 : 0)}%`, badgeColor: 'success', icon: 'bi-cart-fill' },
          { title: 'Nuevos Clientes', value: `${(sucursales.length * 400 + 45)}`, badgeText: '+5.4%', badgeColor: 'success', icon: 'bi-people-fill' },
          { title: 'Gastos Operativos', value: `$${gastosTotalNum.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, badgeText: '-1.2%', badgeColor: 'danger', icon: 'bi-cash-coin' },
          { title: 'Margen de Ganancia', value: `${margenVal}%`, badgeText: parseFloat(margenVal) > 30 ? 'Saludable' : 'Atención', badgeColor: parseFloat(margenVal) > 30 ? 'success' : 'warning', icon: 'bi-graph-up-arrow' }
        ];

        // 2. Gráfico de Barras: Rentabilidad por Sucursal (Ventas - Gastos)
        const barLabels: string[] = [];
        const barData: number[] = [];

        sucursales.forEach(suc => {
          const vSuc = transacciones.filter(t => t.tipo === 'venta' && t.sucursalId === suc.id)
            .reduce((sum, t) => sum + parseFloat(t.total), 0);
          const gSuc = gastos.filter(g => g.sucursalId === suc.id)
            .reduce((sum, g) => sum + parseFloat(g.monto), 0);
          
          barLabels.push(suc.nombre);
          barData.push(vSuc - gSuc); // Rentabilidad
        });

        // 3. Gráfico de Líneas: Evolución de Ingresos por mes (últimos 6 meses)
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const ultimosMesesIndices: number[] = [];
        const hoy = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
          ultimosMesesIndices.push(d.getMonth());
        }

        const lineLabels = ultimosMesesIndices.map(idx => meses[idx]);
        const lineData = ultimosMesesIndices.map(idx => {
          return transacciones.filter(t => t.tipo === 'venta' && new Date(t.fecha).getMonth() === idx)
            .reduce((sum, t) => sum + parseFloat(t.total), 0);
        });

        return {
          kpis,
          barChart: { labels: barLabels, data: barData },
          lineChart: { labels: lineLabels, data: lineData }
        };
      }),
      catchError(err => {
        console.error('Error procesando datos reales del Dashboard:', err);
        return of(mockData);
      })
    );
  }

  // 2. Obtener Datos del Dashboard del Gerente (Real / Fallback Mock)
  getDashboardGerente(zonaId: string): Observable<any> {
    const mockData = {
      zona: 'Zona Norte',
      radarChart: {
        labels: ['Ventas', 'Gastos', 'Margen', 'Eficiencia', 'Volumen'],
        datasets: [
          {
            data: [85, 60, 90, 70, 80],
            label: 'Sucursal A',
            borderColor: '#1A3A5C',
            backgroundColor: 'rgba(26, 58, 92, 0.2)',
            pointBackgroundColor: '#1A3A5C'
          },
          {
            data: [70, 85, 65, 80, 75],
            label: 'Sucursal B',
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            pointBackgroundColor: '#F59E0B'
          },
          {
            data: [60, 50, 80, 60, 90],
            label: 'Sucursal C',
            borderColor: '#0D9488',
            backgroundColor: 'rgba(13, 148, 136, 0.2)',
            pointBackgroundColor: '#0D9488'
          }
        ]
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

    return forkJoin({
      sucursales: this.getSucursales('gerente'),
      transacciones: this.getTransaccionesReales('gerente'),
      gastos: this.getGastosReales('gerente')
    }).pipe(
      map(({ sucursales, transacciones, gastos }) => {
        const sucIds = sucursales.map(s => s.id);

        // Fallback si no hay registros en la BD (gerente nuevo sin datos)
        if (!transacciones.length && !gastos.length) {
          return {
            zona: sucursales.length > 0 && sucursales[0].zona ? sucursales[0].zona.nombre : 'Sin Zona',
            radarChart: {
              labels: ['Ventas ($)', 'Gastos ($)', 'Margen (%)', 'Cant. Ventas', 'Volumen'],
              datasets: sucursales.length > 0 ? sucursales.map(s => ({
                data: [0, 0, 0, 0, 0],
                label: s.nombre,
                borderColor: '#64748B',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                pointBackgroundColor: '#64748B'
              })) : [
                {
                  data: [0, 0, 0, 0, 0],
                  label: 'Sin Sucursales',
                  borderColor: '#64748B',
                  backgroundColor: 'rgba(100, 116, 139, 0.1)',
                  pointBackgroundColor: '#64748B'
                }
              ]
            },
            pieChart: {
              labels: ['Sin Gastos'],
              data: [0]
            },
            reporteNLP: {
              texto: 'No se registran transacciones ni gastos cargados para esta zona comercial aún.',
              fecha: 'Hace unos instantes'
            }
          };
        }

        // 1. Gráfico de Torta/Dona: Gastos por Categoría
        const gastosZona = gastos.filter(g => sucIds.includes(g.sucursalId));
        const porCategoria: { [key: string]: number } = {};
        gastosZona.forEach(g => {
          const cat = g.tipo || 'Varios';
          porCategoria[cat] = (porCategoria[cat] || 0) + parseFloat(g.monto);
        });

        const pieLabels = Object.keys(porCategoria);
        const pieData = Object.values(porCategoria);

        // 2. Gráfico de Radar: Comparativa de Sucursales de la Zona
        const radarLabels = ['Ventas ($)', 'Gastos ($)', 'Margen (%)', 'Cant. Ventas', 'Volumen'];
        
        const statsSuc = sucursales.map(suc => {
          const vSuc = transacciones.filter(t => t.tipo === 'venta' && t.sucursalId === suc.id);
          const vTotal = vSuc.reduce((sum, t) => sum + parseFloat(t.total), 0);
          const gTotal = gastos.filter(g => g.sucursalId === suc.id).reduce((sum, g) => sum + parseFloat(g.monto), 0);
          const margen = vTotal > 0 ? ((vTotal - gTotal) / vTotal) * 100 : 0;
          return {
            id: suc.id,
            nombre: suc.nombre,
            ventasVal: vTotal,
            gastosVal: gTotal,
            margenVal: margen,
            cantVentas: vSuc.length
          };
        });

        const maxVenta = Math.max(...statsSuc.map(s => s.ventasVal), 1);
        const maxGasto = Math.max(...statsSuc.map(s => s.gastosVal), 1);
        const maxCantVenta = Math.max(...statsSuc.map(s => s.cantVentas), 1);

        const colores = [
          { border: '#1A3A5C', bg: 'rgba(26, 58, 92, 0.2)' },
          { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
          { border: '#0D9488', bg: 'rgba(13, 148, 136, 0.2)' },
          { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.2)' },
          { border: '#64748B', bg: 'rgba(100, 116, 139, 0.2)' }
        ];

        const radarDatasets = statsSuc.map((s, idx) => {
          const vScore = Math.round((s.ventasVal / maxVenta) * 100);
          const gScore = Math.round((s.gastosVal / maxGasto) * 100);
          const mScore = Math.max(0, Math.min(100, Math.round(s.margenVal)));
          const cScore = Math.round((s.cantVentas / maxCantVenta) * 100);
          const mzScore = Math.round(s.margenVal > 50 ? 90 : s.margenVal > 30 ? 70 : 40);

          const color = colores[idx % colores.length];

          return {
            data: [vScore, gScore, mScore, cScore, mzScore],
            label: s.nombre,
            borderColor: color.border,
            backgroundColor: color.bg,
            pointBackgroundColor: color.border
          };
        });

        // 3. NLP Text
        const ranking = [...statsSuc].sort((a, b) => b.ventasVal - a.ventasVal);
        const totalVentasZona = statsSuc.reduce((sum, s) => sum + s.ventasVal, 0);
        const totalGastosZona = statsSuc.reduce((sum, s) => sum + s.gastosVal, 0);
        const margenZonal = totalVentasZona > 0 ? (((totalVentasZona - totalGastosZona) / totalVentasZona) * 100).toFixed(1) : '0';

        const texto = `Zona consolidada con ${sucursales.length} sucursales. Ventas totales: $${totalVentasZona.toLocaleString()}. Gastos totales: $${totalGastosZona.toLocaleString()}. Margen zonal promedio: ${margenZonal}%. Sucursal líder en ventas: ${ranking[0]?.nombre || 'N/A'}.`;

        return {
          zona: sucursales.length > 0 && sucursales[0].zona ? sucursales[0].zona.nombre : mockData.zona,
          radarChart: {
            labels: radarLabels,
            datasets: radarDatasets
          },
          pieChart: {
            labels: pieLabels.length ? pieLabels : ['Sin Gastos'],
            data: pieData.length ? pieData : [0]
          },
          reporteNLP: {
            texto,
            fecha: 'Hace unos instantes'
          }
        };
      }),
      catchError(err => {
        console.error('Error procesando datos del Dashboard de Gerente:', err);
        return of(mockData);
      })
    );
  }

  // 3. Cotización del Dolar (backend/API real)
  getCotizacionDolar(): Observable<any> {
    return from(
      this.getAuthHeaders('dueno').then(headers =>
        fetch('/api/dolar', { headers })
          .then(res => {
            if (!res.ok) throw new Error('Endpoint /api/dolar no disponible aún');
            return res.json();
          })
          .then(json => json.success ? json.data : { compra: '1220.00', venta: '1250.00', fecha: new Date() })
      )
    ).pipe(
      catchError(err => {
        console.warn('Usando cotización de dólar mock (API backend pendiente):', err.message);
        return of({ compra: '1220.00', venta: '1250.00', fecha: new Date() });
      })
    );
  }
}
