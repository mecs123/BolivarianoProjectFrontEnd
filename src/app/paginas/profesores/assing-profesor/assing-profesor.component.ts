import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { AssingCursoComponent } from '../../cursos/assing-curso/assing-curso.component';
import { AssingMateriasComponent } from '../../materias/assing-materias/assing-materias.component';
import { FormDataService } from '../../../servicios/FormDataProfesor.service';
import { TeacherRequest } from '../../../interfaces/profesor/ProfesorCreateRequest';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-assing-profesor',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatMenuModule,
    AssingCursoComponent,
    AssingMateriasComponent,
    MatChipsModule,
    MatListModule
  ],
  templateUrl: './assing-profesor.component.html',
  styleUrl: './assing-profesor.component.css'
})
export class AssingProfesorComponent {
  @Input() showForm: boolean = false;
  @Input() showStepper: boolean = false;
  @Output() closeForm = new EventEmitter<void>();
  @Output() cursosSeleccionados = new EventEmitter<any[]>();
  @Output() materiasSeleccionados = new EventEmitter<any[]>();

  profesorForm!: FormGroup;
  emailForm!: FormGroup;
  profesorRequest!: TeacherRequest;
  temporalName!:string;

  selectedCourses: any[] = [];
  selectedSubject: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private _formDataProfesorService: FormDataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkValidation();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  checkValidation() {
    Object.keys(this.profesorForm.controls).forEach((controlName) => {
      const control = this.profesorForm.get(controlName);
      if (control?.invalid) {
        console.log(`El campo ${controlName} es inválido.`);
      }
    });
  }

  private initializeForm() {
    this.profesorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre:[''],
      codTeacher: ['', Validators.required]
    });
  }

  validateEmail() {
    const email = this.profesorForm.get('email')?.value;

    if (email) {  // Validamos que no sea null
      this._formDataProfesorService.getUserEmail(email).subscribe({
        next: (response) => {
          console.log('Correo encontrado:', response);
          this.profesorForm.patchValue({
            nombre: response.fullName
          });
          const nombre = this.profesorForm.get('nombre')!.value;

          console.log(nombre)
        },
        error: (error) => this.onRegisterErrorEmail(error)
      });
    } else {
      console.error('El correo es inválido o está vacío.');
    }
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


  guardarProfesor() {
    if (this.profesorForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    const data = this.cargarFormularioToShowInUpdate();

    this._formDataProfesorService.saveTeacherData(data).subscribe({
      next: () => Swal.fire('¡Guardado!', 'Profesor registrado exitosamente', 'success'

      ).then(()=>{
        window.location.reload();

      }),
      error: (error) => Swal.fire('Error', 'No se pudo guardar la información', error)
    });


  }

  cargarFormularioToShowInUpdate(): TeacherRequest {
    const courses = this.selectedCourses.map((courseName, index) => ({
      idCourse: index + 1,
      nameCourse: courseName
    }));

    const subjects = this.selectedSubject.map((nameSubject, index) => ({
      idSubject: index + 1,
      nameSubject: nameSubject
    }));

    const codTeacher = this.profesorForm.get('codTeacher')?.value;
    const nombreTeacher = this.profesorForm.get('nombre')?.value;
    return {
      codTeacher: codTeacher,
      nameTeacher: nombreTeacher,
      estado: true,
      teacherSubjectRequestDto: subjects,
      teacherCourseRequestDto: courses
    };
  }


  private onRegisterErrorEmail(error: any): void {
    let errorMessage = 'Ha ocurrido un error ingresando el correo.';
    if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos. Por favor, revise los campos del formulario.';
    } else if (error.status === 409) {
      const { campo, mensaje } = error.error;
      errorMessage = campo === 'correo' ? 'El correo ya está registrado. Por favor, usa otro.' : mensaje;
    }
    Swal.fire({
      icon: 'error',
      title: 'Error al validar el correo, Valide con el ADMIN',
      text: errorMessage,
    });
  }

  toggleStepper() {
    this.showStepper = !this.showStepper;
  }

  close() {
    this.closeForm.emit();
  }

}
