import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CoursesService } from '../../../servicios/courses.service';
import { FormDataService } from '../../../servicios/FormDataProfesor.service';

@Component({
  selector: 'app-assing-curso',
  imports: [
     CommonModule,
        MatChipsModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule
  ],
  templateUrl: './assing-curso.component.html',
  styleUrl: './assing-curso.component.css'
})
export class AssingCursoComponent {

  constructor(
      private _formDataCourseService:FormDataService,
      private cdr: ChangeDetectorRef
    ){

    }

    @Output() cursosSeleccionados = new EventEmitter<string[]>();  // Emisor


    ngOnInit(): void {
     this.getAllCourses()
    }

    ngAfterViewInit(): void {

      this.getAllCourses()
    }

    // Lista de cursos disponibles
    cursos: string[] = [];

    // Lista de cursos seleccionados
    seleccionados: string[] = [];
    nameCourse:string='';


    getAllCourses() {
      this._formDataCourseService.getAllCourseToSelectTeacher().subscribe({
        next: (response) => {

          this.nameCourse = response.nameCourse;
          this.cursos = response.map((curso:any)=>curso.nameCourse);

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
      this.cursosSeleccionados.emit(this.seleccionados);
      this.cdr.detectChanges();
    }

    // Función para seleccionar todos los cursos
    adicionarTodos(): void {

      this.seleccionados = [...this.cursos];

      this.cdr.detectChanges();
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
