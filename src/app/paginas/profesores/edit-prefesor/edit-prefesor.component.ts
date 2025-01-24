import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { TeacherSubjectResponseDto } from '../../../interfaces/profesor/response/TeacherResponseDTO';
import { TeacherCourseResponseDto } from '../../../interfaces/ProfesoresInterface';

import {MatIconModule} from '@angular/material/icon';
import {FormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProfesorService } from '../../../servicios/profesores.service';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import { FormDataService } from '../../../servicios/FormDataProfesor.service';
import {MatListModule} from '@angular/material/list'
import { AssingCursoComponent } from "../../cursos/assing-curso/assing-curso.component";
import { Router } from '@angular/router';
import { MenuComponent } from "../../../componentes/menu/menu.component";
import { HeaderComponent } from "../../../componentes/header/header.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { AssingMateriasComponent } from "../../materias/assing-materias/assing-materias.component";
import Swal from 'sweetalert2';
import { UpdateTeacherRequest } from '../../../interfaces/profesor/request/TeacherRequestDTO';
import { CourseInterface } from '../../../interfaces/courses/CourseInterface';
import { GenericBannerComponent } from "../../shared/generic-banner/generic-banner.component";

@Component({
  selector: 'app-edit-prefesor',
  imports: [
    MatSlideToggleModule, MatButtonModule, MatSelectModule, MatTableModule,
    MatIconModule, MatIconModule, MatCheckboxModule, MatCardModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatChipsModule, MatBadgeModule, MatListModule, CommonModule, AssingCursoComponent,
    MenuComponent, MatExpansionModule, MatDatepickerModule, HeaderComponent,
    AssingMateriasComponent,
    GenericBannerComponent
],
  templateUrl: './edit-prefesor.component.html',
  styleUrl: './edit-prefesor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPrefesorComponent implements OnInit {

showCourseList = false;
showSubjectList = false;

toggleCourseList() {
  if (this.showCourseList) {
    // Aquí puedes emitir los datos antes de cerrar la lista
    this.cursosSeleccionados.emit(this.selectedCourses);
  }
  this.showCourseList = !this.showCourseList; // Cambia la visibilidad
}

toggleSubjectList() {
  this.showSubjectList = !this.showSubjectList;
}


  readonly panelOpenState = signal(false);
  step = signal(0);

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }


  editTeacherForm!: FormGroup;
  teacherSubjectsList: TeacherSubjectResponseDto[] = []; // Simulando la lista de asignaturas
  teacherCoursesList: TeacherCourseResponseDto[] = []; // Simulando la lista de cursos
  // Lista de cursos disponibles
  cursos: string[] = [];
  courses: CourseInterface[] = [];
  coursesActual: { nameCourse: string, idCourse: number }[] = [];

  @Input() selectedCourses: CourseInterface[] = [];
  @Output() cursosSeleccionados = new EventEmitter<CourseInterface[]>();


  @Input() selectedSubject: {idSubject:number, nameSubject:string}[]=[];
  @Output() materiasSeleccionados = new EventEmitter<{idSubject:number,nameSubject:string}[]>();

  subjects: {idSubject:number,nameSubject:string}[] = [];
  subjectActual: { nameSubject: string, idSubject: number }[] = [];



  private _teacherService  = inject(ProfesorService)
  dialogRef: any;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {


  }


  ngOnInit(): void {
    const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
    this.coursesActual = teacher.teacherCourseResponseDto.map((course: any) => ({
      idCourse: course.idCourse,
      nameCourse: course.nameCourse
    }));



    this.subjectActual = teacher.teacherSubjectResponseDto.map((subject: any) => ({
      idSubject: subject.idSubject,
      nameSubject: subject.nameSubject
    }));



    console.log('Datos del profesor:', teacher);

    if (teacher && Object.keys(teacher).length) {
      // Inicializar el formulario solo si se obtienen datos válidos del profesor
      this.editTeacherForm = this.fb.group({
        id: [teacher.id || '', Validators.required],
        codTeacher: [teacher.codTeacher || '', Validators.required],
        nameTeacher: [teacher.nameTeacher || '', Validators.required],
        estado: [teacher.estado || '', Validators.required],
        courses: this.fb.array(
          teacher.teacherCourseResponseDto.map((course: any) =>
            this.fb.group({
              idCourse: [course.idCourse],
              nameCourse: [course.nameCourse]
            })
          ) || []
        ),
        subjects: this.fb.array(
          teacher.teacherSubjectResponseDto.map((subject: any) =>
            this.fb.group({
              idSubject: [subject.idSubject],
              nameSubject: [subject.nameSubject]
            })
          ) || []
        )


      });
    } else {
      console.error('No se encontraron datos del profesor');
      this.router.navigate(['/profesor']);
    }
  }



modificar(profesor: any): void {
  const profesorData = profesor.value;

  const dataUpdate = this.mapTeacherData(profesorData);

  console.log('Datos del profesor a actualizar: despues del map', dataUpdate);

  this._teacherService.updateProfesor(profesorData.id, dataUpdate).subscribe({
    next: (response: any) => {
      console.log('Profesor actualizado:', response);

      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: 'El profesor ha sido actualizado correctamente.',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        this.router.navigate(['/profesor']);
      });

    },
    error: (err) => {
      console.error('Error al actualizar el profesor:', err);

      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Hubo un problema al actualizar el profesor. Por favor, inténtelo nuevamente.',
        confirmButtonText: 'Aceptar',
      });
    },
  });
}


  mapTeacherData(profesorData: UpdateTeacherRequest): any {
    return {
      codTeacher: profesorData.codTeacher,
      nameTeacher: profesorData.nameTeacher,
      estado: profesorData.estado,
      teacherCourseRequestDto:
      this.selectedCourses.length > 0
        ? this.selectedCourses.map((course: any) => ({
            idCourse: course.idCourse,
            nameCourse: course.nameCourse,
          }))
        : this.coursesActual,

      teacherSubjectRequestDto:
      this.selectedSubject.length > 0 ?
      this.selectedSubject.map((subject: any) => ({
        idSubject: subject.idSubject,
        nameSubject: subject.nameSubject
      })): this.subjectActual
    };


  }

// En el componente padre, debes cambiar la firma del método para que espere un arreglo de objetos, no solo cadenas
actualizarCursosSeleccionados(cursos: { idCourse: number, nameCourse: string }[]): void {
  this.selectedCourses = cursos; // Ahora seleccionas el arreglo de objetos
  this.cursosSeleccionados.emit(this.selectedCourses); // Emitir los cursos seleccionados
  this.cdr.detectChanges(); // Detectar cambios si es necesario
}


  actualizarMateriasSeleccionadas(subjects: {idSubject:number,nameSubject:string}[]): void {
    this.selectedSubject = subjects;
    this.materiasSeleccionados.emit(this.selectedSubject);
    this.cdr.detectChanges();
  }


  onSubmit(): void {
    if(this.editTeacherForm.valid){

    }

  }

  cancelEdit(): void {
    this.dialogRef.close();
  }

}
