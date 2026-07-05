import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReporteAgente } from '../../reportes/reporte-agente';

const MOCK_REPORTES: ReporteAgente[] = [
  {
    id: 7,
    agente: 'Finanzas AI Agent',
    tipo: 'finanzas',
    tipoLabel: 'Finanzas',
    icono: 'bi-currency-dollar',
    sucursal: 'Sur',
    sucursalId: 3,
    sector: 'Contabilidad',
    fecha: '2026-06-28T15:30:00.000Z',
    resumen: 'Análisis de egresos de la sucursal Sur. Los gastos totales del mes fueron $145,000, un 12% por encima del presupuesto. El rubro de servicios públicos presenta la mayor variación debido a reparaciones no planificadas.',
    datosRelevantes: {
      montoTotalGastos: 145000,
      ingresoNeto: 210000,
      eficiencia: '74%',
      tendencia: 'decreciente',
      variacionPorcentual: -12.0,
    },
    recomendacion: 'Implementar un control de gastos más riguroso para servicios públicos. Establecer un fondo de contingencia para reparaciones.',
    datosCompletos: JSON.stringify({ gastosPorRubro: [{ rubro: 'Servicios', monto: 45000 }, { rubro: 'Mantenimiento', monto: 32000 }] }),
  },
  {
    id: 8,
    agente: 'Anomalías AI Agent',
    tipo: 'anomalias',
    tipoLabel: 'Anomalías',
    icono: 'bi-exclamation-triangle',
    sucursal: 'Centro',
    sucursalId: 1,
    sector: 'Seguridad',
    fecha: '2026-06-25T13:00:00.000Z',
    resumen: 'El sistema de seguridad no detectó anomalías en los patrones de transacciones ni accesos no autorizados. Todos los indicadores se encuentran dentro de los parámetros normales.',
    datosRelevantes: {
      anomaliasDetectadas: 0,
      tendencia: 'normal',
    },
    recomendacion: 'Continuar con los protocolos actuales de seguridad. No se requieren acciones correctivas.',
    datosCompletos: JSON.stringify({ revision: 'Sin incidentes reportados.', ultimaAuditoria: '2026-06-24' }),
  },
];

@Injectable({ providedIn: 'root' })
export class ReporteAgenteService {
  getAll(): Observable<ReporteAgente[]> {
    return of(MOCK_REPORTES);
  }

  getById(id: number): Observable<ReporteAgente | undefined> {
    return of(MOCK_REPORTES.find(r => r.id === id));
  }
}
