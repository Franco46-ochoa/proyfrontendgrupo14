export interface Sucursal {
    id?: number;
    nombre: string;
    direccion: string;
    lat?: number | null;
    lng?: number | null;
    telefono: string;
    zonaId?: number;
    zona?: { id: number; nombre: string };
    createdAt?: string;
  }