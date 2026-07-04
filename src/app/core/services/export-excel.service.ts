import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  exportarDatosAExcel(datos: any[], nombreHoja: string = 'Datos', nombreArchivo: string = 'reporte-financiero.xlsx'): void {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos tabulares para exportar a Excel.');
      return;
    }

    try {
      // 1. Crear una hoja de trabajo (Worksheet) a partir del array de JSON
      const worksheet = XLSX.utils.json_to_sheet(datos);

      // 2. Crear un libro de trabajo (Workbook) vacío
      const workbook = XLSX.utils.book_new();

      // 3. Añadir la hoja de trabajo al libro con su respectivo nombre
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);

      // 4. Guardar y descargar el archivo Excel en el navegador
      XLSX.writeFile(workbook, nombreArchivo);
    } catch (error) {
      console.error('Error al exportar datos a Excel:', error);
    }
  }
}
