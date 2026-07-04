import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  async exportarElementoAPdf(elementId: string, nombreArchivo: string = 'reporte-financiero.pdf'): Promise<void> {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
      console.error(`No se encontró ningún elemento HTML con el ID: ${elementId}`);
      return;
    }

    try {
      // 1. Convertir el elemento HTML del DOM en un Canvas
      const canvas = await html2canvas(elemento, {
        scale: 2, // Mejora la definición/resolución de los gráficos y textos
        useCORS: true, // Crucial para permitir cargar recursos externos como los tiles de Leaflet
        logging: false
      });

      // 2. Extraer la imagen en formato base64
      const imgData = canvas.toDataURL('image/png');

      // 3. Crear el documento PDF en orientación vertical (portrait), milímetros y tamaño A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Ancho del A4 en mm
      const pageHeight = 297; // Alto del A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 4. Agregar la primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 5. Agregar páginas adicionales si el reporte es más largo que una hoja A4
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 6. Descargar el archivo PDF en el navegador
      pdf.save(nombreArchivo);
    } catch (error) {
      console.error('Error al generar la exportación a PDF:', error);
    }
  }
}
