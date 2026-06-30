export interface Transaccion {
    id: number;
    tipo: string;
    cantidad: number;
    precioUnitario: number;
    total: number;
    fecha: string;
    //claves Foraneas
   // idProducto: number;
   // idSucursal: number;
   // idUsuario: number;
  }