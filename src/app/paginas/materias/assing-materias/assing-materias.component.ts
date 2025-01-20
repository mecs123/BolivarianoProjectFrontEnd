import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormDataService } from '../../../servicios/FormDataProfesor.service';

@Component({
  selector: 'app-assing-materias',
  imports: [CommonModule, MatChipsModule,MatIconModule, MatDividerModule,
            MatButtonModule
  ],
  templateUrl: './assing-materias.component.html',
  styleUrl: './assing-materias.component.css'
})
export class AssingMateriasComponent {

   constructor(
        private _formDataSubjectToService:FormDataService,
        private cdr: ChangeDetectorRef
      ){

      }

      @Output() materiasSeleccionados = new EventEmitter<string[]>();  // Emisor


      ngOnInit(): void {
       this.getAllMaterias()
      }

      ngAfterViewInit(): void {
        this.cdr.detectChanges();
        this.getAllMaterias();
      }



      // Lista de cursos disponibles
      materias: string[] = [];

      // Lista de cursos seleccionados
      seleccionados: string[] = [];
      nameSubject:string='';


      getAllMaterias() {
        this._formDataSubjectToService.getAllSubjectToSelectTeacher().subscribe({
          next: (response) => {
            this.materias = response.map((materia:any)=>materia.nameSubject);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al obtener los cursos', err);
          }
        });
      }


      // Función para alternar la selección de un curso
      toggleMateria(materia: string): void {
        if (this.seleccionados.includes(materia)) {
          // Si ya está seleccionado, deseleccionamos
          this.seleccionados = this.seleccionados.filter(item => item !== materia);
          this.materiasSeleccionados.emit(this.seleccionados);
        } else {
          // Si no está seleccionado, lo añadimos
          this.seleccionados.push(materia);
        }

        this.materiasSeleccionados.emit(this.seleccionados);
        this.cdr.detectChanges();
      }

      // Función para seleccionar todos los cursos
      adicionarTodos(): void {
        this.seleccionados = [...this.materias];
        console.log(this.seleccionados,'En el componenete hijo')
        this.cdr.detectChanges();
      }

        // Función para limpiar la selección
        limpiarSeleccion(): void {
          this.seleccionados = [];
        }

          // Función para deseleccionar un curso
      deseleccionarCurso(materia: string): void {
        this.seleccionados = this.seleccionados.filter(item => item !== materia);
      }


}
