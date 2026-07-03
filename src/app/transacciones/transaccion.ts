export interface Transaccion {
    id: number;
    tipo: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    fecha: string;
    observaciones?: string;
    productoId: number;
    sucursalId: number;
    usuarioId?: number;
    producto?: { id: number; nombre: string; codigo: string };
    sucursal?: { id: number; nombre: string };
    usuario?: { id: number; nombre: string };
  }