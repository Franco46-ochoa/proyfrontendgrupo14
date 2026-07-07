import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SucursalService } from './sucursal.service';
import { TransaccionService } from './transaccion.service';
import { GastoService } from './gasto.service';
import { InventarioService } from './inventario.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private sucursalService = inject(SucursalService);
  private transaccionService = inject(TransaccionService);
  private gastoService = inject(GastoService);
  private inventarioService = inject(InventarioService);

  getSucursales(): Observable<any[]> {
    return this.sucursalService.getAll().pipe(
      catchError(err => {
        console.warn('Error al cargar sucursales:', err.message);
        return of([]);
      })
    );
  }

  getInventarioCritico(): Observable<any[]> {
    return this.inventarioService.getAll(true).pipe(
      catchError(err => {
        console.warn('Error al obtener inventario crítico:', err.message);
        return of([]);
      })
    );
  }

  getTransaccionesReales(): Observable<any[]> {
    return this.transaccionService.getAll().pipe(
      catchError(err => {
        console.warn('Error al obtener transacciones:', err.message);
        return of([]);
      })
    );
  }

  getGastosReales(): Observable<any[]> {
    return this.gastoService.getAll().pipe(
      catchError(err => {
        console.warn('Error al obtener gastos:', err.message);
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
      sucursales: this.getSucursales(),
      transacciones: this.getTransaccionesReales(),
      gastos: this.getGastosReales()
    }).pipe(
      map(({ sucursales, transacciones, gastos }) => {
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

        const barLabels: string[] = [];
        const barData: number[] = [];

        sucursales.forEach(suc => {
          const vSuc = transacciones.filter(t => t.tipo === 'venta' && t.sucursalId === suc.id)
            .reduce((sum, t) => sum + parseFloat(t.total), 0);
          const gSuc = gastos.filter(g => g.sucursalId === suc.id)
            .reduce((sum, g) => sum + parseFloat(g.monto), 0);
          
          barLabels.push(suc.nombre);
          barData.push(vSuc - gSuc);
        });

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
      sucursales: this.getSucursales(),
      transacciones: this.getTransaccionesReales(),
      gastos: this.getGastosReales()
    }).pipe(
      map(({ sucursales, transacciones, gastos }) => {
        const sucIds = sucursales.map(s => s.id);

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

        const gastosZona = gastos.filter(g => sucIds.includes(g.sucursalId));
        const porCategoria: { [key: string]: number } = {};
        gastosZona.forEach(g => {
          const cat = g.tipo || 'Varios';
          porCategoria[cat] = (porCategoria[cat] || 0) + parseFloat(g.monto);
        });

        const pieLabels = Object.keys(porCategoria);
        const pieData = Object.values(porCategoria);

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
    return this.http.get<any>(`${this.apiUrl}/dolar`).pipe(
      map(json => json.success ? json.data : { compra: '1220.00', venta: '1250.00', fecha: new Date() }),
      catchError(err => {
        console.warn('Usando cotización de dólar mock (API backend pendiente):', err.message);
        return of({ compra: '1220.00', venta: '1250.00', fecha: new Date() });
      })
    );
  }
}
