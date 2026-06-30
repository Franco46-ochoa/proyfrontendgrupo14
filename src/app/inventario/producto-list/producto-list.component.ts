import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-list',
  imports: [ CommonModule ],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.scss'
})
export class ProductoListComponent implements OnInit {

  productos: Producto[] = [
    { id: 1, nombre: 'Leche Descremada', codigo: 'PROD-001', categoria: 'Lácteos', precioCompra: 850.50, unidadMedida: 'Litro' },
    { id: 2, nombre: 'Harina 0000', codigo: 'PROD-002', categoria: 'Almacén', precioCompra: 450.00, unidadMedida: 'Kg' },
    { id: 3, nombre: 'Pan Lactal', codigo: 'PROD-003', categoria: 'Panadería', precioCompra: 1200.00, unidadMedida: 'Unidad' }
  ];

  constructor() { }

  ngOnInit(): void { }

  eliminarProducto(id: number | undefined) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      console.log('Eliminar producto con ID:', id);
    }
  }
}
