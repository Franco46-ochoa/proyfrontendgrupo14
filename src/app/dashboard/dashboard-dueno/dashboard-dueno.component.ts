import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { SucursalMapaComponent } from '../../sucursales/sucursal-mapa/sucursal-mapa.component';
import { DashboardService } from '../../core/services/dashboard.service'; // <-- Importar servicio
import { ChartConfiguration, ChartData } from 'chart.js';
<<<<<<< HEAD
import { ExportExcelService } from '../../core/services/export-excel.service';
=======
import { forkJoin } from 'rxjs';
import { DolarCardComponent } from '../../shared/components/dolar-card/dolar-card.component';

>>>>>>> feature/dashboards

@Component({
  selector: 'app-dashboard-dueno',
  imports: [
    CommonModule,
    KpiCardComponent,
    ChartCardComponent,
    SucursalMapaComponent,
    DolarCardComponent
  ],
  templateUrl: './dashboard-dueno.component.html',
  styleUrl: './dashboard-dueno.component.scss'
})
export class DashboardDuenoComponent implements OnInit {
  private dashboardService = inject(DashboardService); // <-- Inyectar servicio
<<<<<<< HEAD
  private exportExcelService = inject(ExportExcelService);
=======
  fechaActual: string = '';
>>>>>>> feature/dashboards

  kpis: any[] = [];
  sucursales: any[] = []; // <-- Arreglo para almacenar sucursales reales del backend

  // Propiedades para el modal de exportación
  mostrarModalExportar = false;
  modalTipo: 'excel' | 'pdf' = 'excel';

  // Gráfico de Barras
  public barChartType = 'bar' as const;
  public barChartData!: ChartData<'bar'>;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } }
  };

  // Gráfico de Línea
  public lineChartType = 'line' as const;
  public lineChartData!: ChartData<'line'>;
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } }
  };

  ngOnInit(): void {
    const hoy = new Date();
    const diaSemana = hoy.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();
    const diaNumero = hoy.getDate();
    const mes = hoy.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '');
    const anio = hoy.getFullYear();
    this.fechaActual = `${diaSemana} ${diaNumero} de ${mes} ${anio}`;

    // Cargar sucursales reales del backend y el inventario crítico combinados
    forkJoin({
      sucursales: this.dashboardService.getSucursales('dueno'),
      criticos: this.dashboardService.getInventarioCritico('dueno')
    }).subscribe({
      next: ({ sucursales, criticos }) => {
        this.sucursales = sucursales.map(suc => {
          const itemsCriticos = criticos.filter((c: any) => c.sucursalId === suc.id);
          return {
            ...suc,
            stockCriticoCount: itemsCriticos.length
          };
        });
      },
      error: err => {
        console.error('Error al cargar datos del mapa:', err);
      }
    });


    // Consumir el servicio mock
    this.dashboardService.getDashboardDueno().subscribe(data => {
      this.kpis = data.kpis;

      // Asignar datos del gráfico de barras
      this.barChartData = {
        labels: data.barChart.labels,
        datasets: [{
          data: data.barChart.data,
          label: 'Rentabilidad ($)',
          backgroundColor: '#1A3A5C',
          hoverBackgroundColor: '#F59E0B',
          borderRadius: 6
        }]
      };

      // Asignar datos del gráfico de líneas
      this.lineChartData = {
        labels: data.lineChart.labels,
        datasets: [{
          data: data.lineChart.data,
          label: 'Ingresos Mensuales ($)',
          borderColor: '#0D9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    });
  }

<<<<<<< HEAD
  esDuenoOAdmin(): boolean {
    const rol = (localStorage.getItem('role') || '').toLowerCase();
    return rol === 'dueno' || rol === 'administrador';
  }

  abrirModal(tipo: 'excel' | 'pdf'): void {
    this.modalTipo = tipo;
    this.mostrarModalExportar = true;
  }

  cerrarModal(): void {
    this.mostrarModalExportar = false;
  }

  descargarExcel(modulo: 'transacciones' | 'gastos' | 'inventario' | 'productos'): void {
    if (modulo === 'transacciones') {
      const transaccionesMock = [
        { id: 45, fecha: '10/06/2026', tipo: 'Venta', producto: 'Azúcar Ledesma 1kg', codigo: 'AZU-001', cantidad: 5, precioUnitario: 1750, total: 8750, sucursal: 'Sucursal Central', registradoPor: 'Empleado Ventas', observaciones: 'Venta mostrador' },
        { id: 44, fecha: '10/06/2026', tipo: 'Compra', producto: 'Harina 0000 1kg', codigo: 'HAR-002', cantidad: 20, precioUnitario: 1000, total: 20000, sucursal: 'Sucursal Sur', registradoPor: 'Empleado Depósito', observaciones: 'Reabastecimiento' }
      ];
      this.exportExcelService.exportarTransacciones(transaccionesMock);
    } else if (modulo === 'gastos') {
      const gastosMock = [
        { id: 12, fecha: '15/06/2026', tipo: 'Mantenimiento', descripcion: 'Reparación cinta transportadora', monto: 45000, proveedor: 'Vexar S.A.', cuitProveedor: '30-12345678-9', sucursal: 'Sucursal Central', anomalia: false },
        { id: 13, fecha: '18/06/2026', tipo: 'Servicios', descripcion: 'Factura electricidad Edesur', monto: 85000, proveedor: 'Edesur', cuitProveedor: '30-98765432-1', sucursal: 'Sucursal Sur', anomalia: false }
      ];
      this.exportExcelService.exportarGastos(gastosMock);
    } else if (modulo === 'inventario') {
      const inventarioMock = [
        { id: 78, producto: 'Azúcar Ledesma 1kg', codigo: 'AZU-001', categoria: 'Alimentos', sucursal: 'Sucursal Central', stockActual: 45, stockMinimo: 10, stockMaximo: 200, precioCompra: 800, precioVenta: 1750 },
        { id: 79, producto: 'Leche Entera La Serenísima 1L', codigo: 'LEC-002', categoria: 'Lácteos', sucursal: 'Sucursal Norte', stockActual: 5, stockMinimo: 20, stockMaximo: 100, precioCompra: 900, precioVenta: 1300 }
      ];
      this.exportExcelService.exportarInventario(inventarioMock);
    } else if (modulo === 'productos') {
      const productosMock = [
        { id: 1, codigo: 'PROD-001', nombre: 'Leche Descremada', categoria: 'Lácteos', precioCompra: 850.50, unidadMedida: 'Litro', activo: true },
        { id: 2, codigo: 'PROD-002', nombre: 'Harina 0000', categoria: 'Almacén', precioCompra: 450.00, unidadMedida: 'Kg', activo: true },
        { id: 3, codigo: 'PROD-003', nombre: 'Pan Lactal', categoria: 'Panadería', precioCompra: 1200.00, unidadMedida: 'Unidad', activo: true }
      ];
      this.exportExcelService.exportarProductos(productosMock);
    }
  }

  descargarPdf(modulo: string): void {
    // Cuando el backend esté listo se usará: window.open(`/api/export/${modulo}/pdf`, '_blank');
    alert(`Conexión maquetada para PDF: Solicitando al backend la generación de PDF para el módulo: ${modulo.toUpperCase()}`);
  }
=======
>>>>>>> feature/dashboards
}
