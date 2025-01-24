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

      @Output() materiasSeleccionados = new EventEmitter<{idSubject:number,nameSubject:string}[]>();  // Emisor


      ngOnInit(): void {
       this.getAllMaterias()
      }

      ngAfterViewInit(): void {
        this.cdr.detectChanges();
        this.getAllMaterias();
      }

      // Lista de cursos disponibles
      materias: { idSubject: number; nameSubject: string }[] = [];


      // Lista de cursos seleccionados
      seleccionados: { idSubject: number; nameSubject: string }[] = [];
      nameSubject:string='';


      getAllMaterias() {
        this._formDataSubjectToService.getAllSubjectToSelectTeacher().subscribe({

          next: (response) => {
            this.materias = response.map((materia: any) => ({
              idSubject: materia.id,
              nameSubject: materia.nameSubject
            }));

            console.log(this.materias,'En el componente hijo assing-materias'


          );


            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al obtener los cursos', err);
          }
        });
      }


      // Función para alternar la selección de un curso
      toggleMateria(materia: { idSubject: number; nameSubject: string }): void {
        if (this.seleccionados.some(item => item.idSubject === materia.idSubject)) {
          // Si ya está seleccionado, deseleccionamos
          this.seleccionados = this.seleccionados.filter(item => item.idSubject !== materia.idSubject);
        } else {
          // Si no está seleccionado, lo añadimos
          this.seleccionados.push(materia);
        }

        // Emitir la lista actualizada de materias seleccionadas
        this.materiasSeleccionados.emit(this.seleccionados);
        this.cdr.detectChanges();
      }


      isSubjectSeleccionado(materia: { idSubject: number; nameSubject: string }): boolean {

        return this.seleccionados.some(item => item.idSubject === materia.idSubject);
      }

      // Función para seleccionar todos los cursos
      adicionarTodos(): void {
     //   this.seleccionados = [...this.materias];
        console.log(this.seleccionados,'En el componenete hijo')
        this.cdr.detectChanges();
      }

        // Función para limpiar la selección
        limpiarSeleccion(): void {
          this.seleccionados = [];
        }

          // Función para deseleccionar un curso
      deseleccionarCurso(materia: { idSubject: number; nameSubject: string }): void {
        this.seleccionados = this.seleccionados.filter(item => item !== materia);
      }


      seleccionarMateria(materia: {idSubject: number, nameSubject: string}) {
        // Verifica si la materia ya está seleccionada
        if (!this.seleccionados.some(m => m.idSubject === materia.idSubject)) {
          // Si no está seleccionada, la agregas
          this.seleccionados.push(materia);
        }
      }

      deseleccionarMateria(materia: {idSubject: number, nameSubject: string}) {
        // Eliminar la materia de los seleccionados
        this.seleccionados = this.seleccionados.filter(m => m.idSubject !== materia.idSubject);
      }


}
