import { Component, OnInit } from '@angular/core';
import { Gasto } from '../gasto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gasto-list',
  imports: [CommonModule],
  templateUrl: './gasto-list.component.html',
  styleUrl: './gasto-list.component.scss'
})
export class GastoListComponent implements OnInit {
  gastos: Gasto[] = [
    { id: 1, tipo: 'Servicios', monto: 25000, descripcion: 'Luz Edesur', fecha: '2026-06-29', anomalia: false },
    { id: 2, tipo: 'Alquiler', monto: 150000, descripcion: 'Alquiler local Sur', fecha: '2026-06-29', anomalia: true } // Gasto duplicado simulado
  ];
  constructor() { }
  ngOnInit(): void { }
}
