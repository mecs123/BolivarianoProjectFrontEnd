// Interface para las materias (Subjects)
export interface TeacherSubjectRequestDto {

  nameSubject?: string;
}

// Interface para los cursos (Courses)
export interface TeacherCourseRequestDto {
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
