export interface Gasto {
    id: number;
    tipo: string;
    monto: number;
    descripcion: string;
    fecha: string;
    anomalia: boolean;
    proveedorId?: number;
    sucursalId: number;
    proveedor?: { id: number; nombre: string; cuit: string };
    sucursal?: { id: number; nombre: string };
}
