// Interface para las materias (Subjects)
export interface TeacherSubjectRequestDto {
  idSubject?: number;
  nameSubject?: string;
}

// Interface para los cursos (Courses)
export interface TeacherCourseRequestDto {
  idCourse?: number;
  nameCourse?: string;
}

// Interface principal para el profesor (Teacher)
export interface TeacherRequest {
  codTeacher: string;
  nameTeacher?: string;
  estado?: boolean;
  teacherSubjectRequestDto?: TeacherSubjectRequestDto[];
  teacherCourseRequestDto?: TeacherCourseRequestDto[];
}
