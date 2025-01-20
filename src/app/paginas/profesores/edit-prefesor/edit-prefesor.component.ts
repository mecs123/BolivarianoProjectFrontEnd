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
import { ActivatedRoute, Router } from '@angular/router';
import { MenuComponent } from "../../../componentes/menu/menu.component";
import { HeaderComponent } from "../../../componentes/header/header.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { AssingMateriasComponent } from "../../materias/assing-materias/assing-materias.component";

@Component({
  selector: 'app-edit-prefesor',
  imports: [
    MatSlideToggleModule, MatButtonModule, MatSelectModule, MatTableModule,
    MatIconModule, MatIconModule, MatCheckboxModule, MatCardModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatChipsModule, MatBadgeModule, MatListModule, CommonModule, AssingCursoComponent,
    MenuComponent, MatExpansionModule, MatDatepickerModule, HeaderComponent,
    AssingMateriasComponent
],
  templateUrl: './edit-prefesor.component.html',
  styleUrl: './edit-prefesor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPrefesorComponent implements OnInit {

showCourseList = false;

toggleCourseList() {
  this.showCourseList = !this.showCourseList;
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
  courses: { nameCourse: string, idCourse: number }[] = [];
  @Input() selectedCourses: string[] = [];
  @Output() cursosSeleccionados = new EventEmitter<string[]>();

  @Input() selectedSubject: string[]=[];
  @Output() materiasSeleccionados = new EventEmitter<string[]>();

  // Lista de cursos seleccionados
  seleccionados: string[] = [];
  nameCourse:string='';

  private _teacherService  = inject(ProfesorService)
  dialogRef: any;
  constructor(
    private fb: FormBuilder,
    private _formDataCourseService:FormDataService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {


  }


  ngOnInit(): void {
    const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
    console.log("Esto llego ", teacher)

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



  modificar(prefesor:any){
    this._teacherService.updateProfesor(1,prefesor)

  }

  getAllCourses() {
    this._formDataCourseService.getAllCourseToSelectTeacher().subscribe({
      next: (response: any[]) => {
        this.courses = response.map(course => ({
          nameCourse: course.nameCourse,
          idCourse: course.idCourse
        }));
      },
      error: (err) => {
        console.error('Error al obtener los cursos', err);
      }
    });
  }

  actualizarCursosSeleccionados(cursos: string[]): void {
    this.selectedCourses = cursos;
    this.cursosSeleccionados.emit(this.selectedCourses);
    this.cdr.detectChanges();

  }

  actualizarMateriasSeleccionadas(subjects: string[]): void {
    this.selectedSubject = subjects;
    this.materiasSeleccionados.emit(subjects);
    console.log('Materias seleccionadas:', subjects);
    this.cdr.detectChanges();
  }


  onSubmit(): void {
    if(this.editTeacherForm.valid){
      console.log('Formulario enviado:', this.editTeacherForm.value);
    }

  }

  cancelEdit(): void {
    this.dialogRef.close();
  }

}
