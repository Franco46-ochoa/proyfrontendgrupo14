import { Component,  Input,
  Output,
  EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent {

@Input() columns: string[] = [];
@Input() data: any[] = [];
@Input() totalPages: number = 1;

@Output() search = new EventEmitter<string>();
@Output() sort = new EventEmitter<string>();
@Output() pageChange = new EventEmitter<number>();


  onSearch(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onSort(column: string): void {
    this.sort.emit(column);
  }

  changePage(page: number): void {
    this.pageChange.emit(page);
  }
  

}
