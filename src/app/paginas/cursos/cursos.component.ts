import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { CoursesService } from '../../servicios/courses.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeaderComponent } from '../../componentes/header/header.component';
import { MenuComponent } from '../../componentes/menu/menu.component';
import { BannerComponent } from '../shared/banner/banner.component';
import { GenericBannerComponent } from "../shared/generic-banner/generic-banner.component";
import { AssingCursoComponent } from './assing-curso/assing-curso.component';


@Component({
  selector: 'app-cursos',
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MenuComponent,
    HeaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    CommonModule,
    GenericBannerComponent
],
  templateUrl: './cursos.component.html',
    styleUrl: './cursos.component.css',
  styles: ``
})
export class CursosComponent implements OnInit{


  assingCourseComponent = AssingCursoComponent;

  cursos: any[] = [];
  dataSource = new MatTableDataSource<any>(this.cursos);
  displayedColumns: string[] = ['id', 'curso'];
  seleccionados: string[] = [];
  nameCourse:string='';

  constructor(
    private _courseService:CoursesService,
    private cdr: ChangeDetectorRef
  ){

  }

  @Output() cursosSeleccionados = new EventEmitter<string[]>();  // Emisor


  ngOnInit(): void {
   this.getAllCourses()
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  crear(){
    console.log('popocurso')
  }



  getAllCourses(): void {
    this._courseService.getAllCourses().subscribe({
      next: (response) => {
        this.cursos = response;
        this.dataSource.data = this.cursos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener los cursos', err);
      }
    });
  }


  // Función para alternar la selección de un curso
  toggleCurso(curso: string): void {
    if (this.seleccionados.includes(curso)) {
      // Si ya está seleccionado, deseleccionamos
      this.seleccionados = this.seleccionados.filter(item => item !== curso);
      this.cursosSeleccionados.emit(this.seleccionados);
    } else {
      // Si no está seleccionado, lo añadimos
      this.seleccionados.push(curso);
    }
  }

  // Función para seleccionar todos los cursos
  adicionarTodos(): void {
    console.log(this.seleccionados)
    this.seleccionados = [...this.cursos];
  }

    // Función para limpiar la selección
    limpiarSeleccion(): void {
      this.seleccionados = [];
    }

      // Función para deseleccionar un curso
  deseleccionarCurso(curso: string): void {
    this.seleccionados = this.seleccionados.filter(item => item !== curso);
  }



}
