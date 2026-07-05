import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  /**
   * Genera el nombre del archivo dinámico con año-mes actual (Ej: transacciones_2026-07.xlsx)
   */
  private obtenerNombreArchivo(prefijo: string): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    return `${prefijo}_${anio}-${mes}.xlsx`;
  }

  /**
   * Guarda el buffer binario como un archivo descargable usando file-saver
   */
  private guardarArchivoExcel(workbook: XLSX.WorkBook, nombreArchivo: string): void {
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, nombreArchivo);
  }

  /**
   * Ajusta automáticamente el ancho de las columnas basado en el contenido más largo
   */
  private ajustarAnchosColumnas(worksheet: XLSX.WorkSheet): void {
    const objectMaxLength: any[] = [];
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLen = 10; // Ancho mínimo
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = worksheet[cellRef];
        if (cell && cell.v !== undefined && cell.v !== null) {
          const cellValue = cell.v.toString();
          if (cellValue.length > maxLen) {
            maxLen = cellValue.length;
          }
        }
      }
      objectMaxLength.push({ wch: maxLen + 2 });
    }
    worksheet['!cols'] = objectMaxLength;
  }

  /**
   * 1. Exportar Transacciones a Excel
   */
  exportarTransacciones(datos: any[]): void {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos de transacciones para exportar.');
      return;
    }

    // Mapear datos a headers en español
    const excelData = datos.map(t => ({
      ID: t.id,
      Fecha: t.fecha,
      Tipo: t.tipo,
      Producto: t.producto || 'N/A',
      Código: t.codigo || 'N/A',
      Cantidad: t.cantidad,
      'Precio Unitario ($)': t.precioUnitario,
      'Total ($)': t.total,
      Sucursal: t.sucursal || 'N/A',
      'Registrado por': t.registradoPor || 'N/A',
      Observaciones: t.observaciones || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Calcular valores de la fila de resumen
    const ventas = datos.filter(t => t.tipo?.toLowerCase() === 'venta');
    const compras = datos.filter(t => t.tipo?.toLowerCase() === 'compra');
    const totalVentas = ventas.reduce((sum, t) => sum + (t.total || 0), 0);
    const totalCompras = compras.reduce((sum, t) => sum + (t.total || 0), 0);
    const cantOperaciones = datos.length;
    const ticketPromedio = ventas.length > 0 ? totalVentas / ventas.length : 0;

    // Fila de resumen al final
    const resumen = [
      [],
      ['Resumen de Operaciones'],
      ['Total Ventas ($)', totalVentas],
      ['Total Compras ($)', totalCompras],
      ['Operaciones Totales', cantOperaciones],
      ['Ticket Promedio Ventas ($)', ticketPromedio]
    ];

    XLSX.utils.sheet_add_aoa(worksheet, resumen, { origin: -1 });
    this.ajustarAnchosColumnas(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones');

    const nombreArchivo = this.obtenerNombreArchivo('transacciones');
    this.guardarArchivoExcel(workbook, nombreArchivo);
  }

  /**
   * 2. Exportar Gastos a Excel
   */
  exportarGastos(datos: any[]): void {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos de gastos para exportar.');
      return;
    }

    const excelData = datos.map(g => ({
      ID: g.id,
      Fecha: g.fecha,
      Tipo: g.tipo,
      Descripción: g.descripcion,
      'Monto ($)': g.monto,
      Proveedor: g.proveedor || 'N/A',
      'CUIT Proveedor': g.cuitProveedor || 'N/A',
      Sucursal: g.sucursal || 'N/A',
      Anomalía: g.anomalia ? 'Sí' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Calcular fila resumen
    const totalGastos = datos.reduce((sum, g) => sum + (g.monto || 0), 0);
    const cantAnomalias = datos.filter(g => g.anomalia).length;
    const gastoPromedio = datos.length > 0 ? totalGastos / datos.length : 0;

    // Top Categoría
    const cats: { [key: string]: number } = {};
    datos.forEach(g => {
      const cat = g.tipo || 'Varios';
      cats[cat] = (cats[cat] || 0) + (g.monto || 0);
    });
    let topCat = 'N/A';
    let maxMonto = 0;
    Object.keys(cats).forEach(cat => {
      if (cats[cat] > maxMonto) {
        maxMonto = cats[cat];
        topCat = cat;
      }
    });

    const resumen = [
      [],
      ['Resumen de Gastos'],
      ['Total Gastos ($)', totalGastos],
      ['Gastos con Anomalías', cantAnomalias],
      ['Gasto Promedio ($)', gastoPromedio],
      ['Top Categoría de Gasto', topCat]
    ];

    XLSX.utils.sheet_add_aoa(worksheet, resumen, { origin: -1 });
    this.ajustarAnchosColumnas(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos');

    const nombreArchivo = this.obtenerNombreArchivo('gastos');
    this.guardarArchivoExcel(workbook, nombreArchivo);
  }

  /**
   * 3. Exportar Inventario (Control de Stock) a Excel
   */
  exportarInventario(datos: any[]): void {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos de inventario para exportar.');
      return;
    }

    const excelData = datos.map(i => {
      const margen = i.precioCompra > 0 
        ? (((i.precioVenta - i.precioCompra) / i.precioCompra) * 100) 
        : 0;

      return {
        ID: i.id,
        Producto: i.producto || 'N/A',
        Código: i.codigo || 'N/A',
        Categoría: i.categoria || 'N/A',
        Sucursal: i.sucursal || 'N/A',
        'Stock Actual': i.stockActual,
        'Stock Mínimo': i.stockMinimo,
        'Stock Máximo': i.stockMaximo || 0,
        'Precio Compra ($)': i.precioCompra || 0,
        'Precio Venta ($)': i.precioVenta || 0,
        'Margen (%)': `${margen.toFixed(2)}%`,
        Estado: i.stockActual < i.stockMinimo ? 'Crítico' : 'OK'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Calcular fila resumen
    const totalProductos = datos.reduce((sum, i) => sum + (i.stockActual || 0), 0);
    const productosCriticos = datos.filter(i => i.stockActual < i.stockMinimo).length;
    const valorTotalInventario = datos.reduce((sum, i) => sum + ((i.stockActual || 0) * (i.precioCompra || 0)), 0);

    const resumen = [
      [],
      ['Resumen de Inventario'],
      ['Total de Artículos en Stock', totalProductos],
      ['Artículos en Stock Crítico', productosCriticos],
      ['Valor Total del Inventario ($)', valorTotalInventario]
    ];

    XLSX.utils.sheet_add_aoa(worksheet, resumen, { origin: -1 });
    this.ajustarAnchosColumnas(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock');

    const nombreArchivo = this.obtenerNombreArchivo('inventario');
    this.guardarArchivoExcel(workbook, nombreArchivo);
  }

  /**
   * 4. Exportar Catálogo de Productos a Excel
   */
  exportarProductos(datos: any[]): void {
    if (!datos || datos.length === 0) {
      console.warn('No hay datos de productos para exportar.');
      return;
    }

    const excelData = datos.map(p => ({
      ID: p.id,
      Código: p.codigo || 'N/A',
      Nombre: p.nombre,
      Categoría: p.categoria || 'N/A',
      Descripción: p.descripcion || '',
      'Precio Compra ($)': p.precioCompra || 0,
      'Unidad de Medida': p.unidadMedida || 'unidad',
      Activo: p.activo !== false ? 'Sí' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    this.ajustarAnchosColumnas(worksheet);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    const nombreArchivo = this.obtenerNombreArchivo('productos');
    this.guardarArchivoExcel(workbook, nombreArchivo);
  }
}
