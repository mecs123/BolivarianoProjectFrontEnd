import { Component, OnInit, inject } from '@angular/core';
import { MenuComponent } from "../../componentes/menu/menu.component";
import { HeaderComponent } from "../../componentes/header/header.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProfesorService } from '../../servicios/profesores.service';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BannerComponent } from "../shared/banner/banner.component";
import Swal from 'sweetalert2';
import { TeacherResponseDTO } from '../../interfaces/profesor/response/TeacherResponseDTO';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profesores',
  standalone: true, // Marca el componente como standalone si no tiene un módulo propio
  imports: [
    MenuComponent,HeaderComponent, MatTableModule,MatPaginatorModule,
    MatIconModule,MatDividerModule,MatButtonModule,CommonModule,BannerComponent
],
  templateUrl: './profesores.component.html',
   styleUrl: './profesores.component.css'
})
export class ProfesoresComponent implements OnInit{

  constructor(private router: Router) {}


  profesores = [ /* your data */ ];
  profesoreById!: TeacherResponseDTO;
  dataSource = new MatTableDataSource(this.profesores);
  displayedColumns: string[] = ['id','nameTeacher', 'codTeacher', 'estado','acciones'];

  ngOnInit(): void {
    this.listAllTeacher()
  }


  profesoresService = inject(ProfesorService)

  listAllTeacher() {
    this.profesoresService.getAllProfesores().subscribe({
      next: (data) => {
        this.profesores = data.body.content;
        this.dataSource = new MatTableDataSource(this.profesores);

      },
      error: (err) => {
        console.error('Error al obtener los profesores', err);
      }
    });
  }



  verProfesor(teacher: any): void {
    this.profesoresService.getProfesorById(teacher.id).subscribe({
      next: (data: any) => {
        const profesor = data.body;
        console.log("llego del backend",profesor)

        const subjects = profesor.teacherSubjectResponseDto
          ? profesor.teacherSubjectResponseDto
              .map((subject: any) => `<li>${subject.nameSubject}</li>`)
              .join('')
          : 'No asignaturas disponibles';

        const courses = profesor.teacherCourseResponseDto
          ? profesor.teacherCourseResponseDto
              .map((course: any) => `<li>${course.nameCourse}</li>`)
              .join('')
          : 'No cursos disponibles';

        Swal.fire({
          title: 'Detalles del Profesor',
          html: `
            <strong>Nombre:</strong> ${profesor.nameTeacher}<br>
            <strong>Código:</strong> ${profesor.codTeacher}<br>
            <strong>Estado:</strong> ${profesor.estado ? 'Activo' : 'Inactivo'}<br>
            <strong>Asignaturas:</strong><ul>${subjects}</ul>
            <strong>Cursos:</strong><ul>${courses}</ul>
          `,
          icon: 'info',
          confirmButtonText: 'Cerrar'
        });
      },
      error: (error) => {
        console.error('Error al obtener el profesor por ID:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información del profesor.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  editarProfesor(teacher: any): void {
    localStorage.setItem('teacher', JSON.stringify(teacher));
    this.router.navigate(['/editar-profesor', teacher.id], {
      state: { teacher } // Pasa los datos del profesor al componente de destino
    });
    console.log("Esto se va",teacher)
  }


  eliminarProfesor(teacher: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar al profesor ${teacher.nameTeacher}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para eliminar al profesor
        console.log('Profesor eliminado:', teacher);
        Swal.fire('Eliminado', 'El profesor ha sido eliminado.', 'success');
      }
    });
  }




}





