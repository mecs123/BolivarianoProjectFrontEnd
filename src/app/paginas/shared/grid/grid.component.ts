import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Persona } from '../../../interfaces/Persona';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-grid',
  imports: [CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDividerModule

   ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit, AfterViewInit {

  @Input() data: any[] = [];
  @Input() titulo: string = '';
  @Input() displayedColumns: { header: string, field: string }[] = [];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.dataSource.data = this.data;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getColumnFields(): string[] {
    return this.displayedColumns.map(column => column.field);
  }

  editarElemento(element: any) {
    console.log('Editar:', element);
  }

  eliminarElemento(element: any) {
    console.log('Eliminar:', element);
  }
}
