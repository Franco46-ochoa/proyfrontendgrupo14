export interface Inventario {
    id: number;
    productoId: number;
    sucursalId: number;
    stockActual: number;
    stockMinimo: number;
    stockMaximo?: number;
    precioVenta: number;
    producto?: { id: number; nombre: string; codigo: string; precioCompra: number };
    sucursal?: { id: number; nombre: string };
}
