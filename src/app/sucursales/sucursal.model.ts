export interface Sucursal {
    id?: number;
    nombre: string;
    direccion: string;
    lat: number;
    lng: number;
    telefono: string;
    zonaId?: number;
    zona?: { id: number; nombre: string };
  }