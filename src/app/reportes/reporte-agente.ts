export interface DatosRelevantes {
  stockActual?: number;
  stockMinimo?: number;
  productosBajoStock?: number;
  tendencia?: string;
  variacionPorcentual?: number;
  anomaliasDetectadas?: number;
  totalVentas?: number;
  totalCompras?: number;
  ingresoNeto?: number;
  productoTop?: string;
  categoriaTop?: string;
  montoTotalGastos?: number;
  eficiencia?: string;
}

export interface ReporteAgente {
  id: number;
  agente: string;
  tipo: string;
  tipoLabel: string;
  icono: string;
  sucursal: string;
  sucursalId: number;
  sector: string;
  fecha: string;
  resumen: string;
  datosRelevantes: DatosRelevantes;
  recomendacion: string;
  datosCompletos?: string;
}

export const TIPOS_AGENTE = [
  { value: '', label: 'Todos los agentes' },
  { value: 'stock', label: 'Stock AI' },
  { value: 'ventas', label: 'Ventas AI' },
  { value: 'finanzas', label: 'Finanzas AI' },
  { value: 'anomalias', label: 'Anomalías AI' },
];
