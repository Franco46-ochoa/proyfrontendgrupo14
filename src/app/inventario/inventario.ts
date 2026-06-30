export interface Inventario {
    id: number;
    producto: string;
    sucursal: string;
    stockActual: number;
    stockMinimo: number;
    precioVenta: number;
}
