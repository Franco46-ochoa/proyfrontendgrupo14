export interface Gasto {
    id: number;
    tipo: string;
    monto: number;
    descripcion: string;
    fecha: string;
    anomalia: boolean;
    //claves Foraneas
    //proveedorId: number;
    //sucursalId: number;
}
