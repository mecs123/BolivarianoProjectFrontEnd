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


    @Output() cursosSeleccionados = new EventEmitter<{ idCourse: number, nameCourse: string }[]>();



    ngOnInit(): void {
     this.getAllCourses()
    }

    ngAfterViewInit(): void {

      this.getAllCourses()
    }

    // Lista de cursos disponibles
    cursos: { idCourse: number, nameCourse: string }[] = [];


    // Lista de cursos seleccionados
    // Lista de cursos seleccionados con id y nombre
    seleccionados: { idCourse: number, nameCourse: string }[] = [];

    nameCourse:string='';
    idCourse:number=0;


    getAllCourses() {
      this._formDataCourseService.getAllCourseToSelectTeacher().subscribe({
        next: (response) => {
         this.cursos = response.map((curso: any) => ({
        idCourse: curso.id,
        nameCourse: curso.nameCourse

      }));

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al obtener los cursos', err);
        }
      });
    }


    // Función para alternar la selección de un curso
  // Función para alternar la selección de un curso
  toggleCurso(curso: { idCourse: number, nameCourse: string }): void {
    if (this.isCursoSeleccionado(curso)) {
      // Si ya está seleccionado, deseleccionamos
      this.seleccionados = this.seleccionados.filter(item => item.idCourse !== curso.idCourse);
    } else {
      // Si no está seleccionado, lo añadimos
      this.seleccionados.push({ idCourse: curso.idCourse, nameCourse: curso.nameCourse });
    }

    this.cursosSeleccionados.emit(this.seleccionados); // Emitir los cursos seleccionados
    this.cdr.detectChanges();
  }


// Verificar si un curso está seleccionado
isCursoSeleccionado(curso: { idCourse: number, nameCourse: string }): boolean {
  return this.seleccionados.some(c => c.idCourse === curso.idCourse);
}





    // Función para seleccionar todos los cursos


    adicionarTodos(): void {

      //this.seleccionados = [...this.cursos];

      this.cdr.detectChanges();
    }

      // Función para limpiar la selección
      limpiarSeleccion(): void {
        this.seleccionados = [];
      }

        // Función para deseleccionar un curso
  // Función para deseleccionar un curso
deseleccionarCurso(curso: { idCourse: number, nameCourse: string }): void {
  // Filtra los cursos seleccionados para eliminar el curso que coincide con el idCourse
  this.seleccionados = this.seleccionados.filter(item => item.idCourse !== curso.idCourse);
}



}
