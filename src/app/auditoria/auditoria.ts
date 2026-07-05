export type AccionAuditoria = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';

export interface Auditoria {
  id: number;
  accion: AccionAuditoria;
  entidad: string;
  entidadId?: number;
  usuario: string;
  usuarioId?: number;
  fecha: string;
  datosAnteriores?: any;
  datosNuevos?: any;
}
