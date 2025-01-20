export interface TeacherSubjectResponseDto {
  idSubject: number;
  nameSubject: string;
}

export interface TeacherCourseResponseDto {
  idCourse: number;
  nameCourse: string;
}

export interface TeacherResponseDTO {
  id: number;
  nameTeacher: string;
  codTeacher: string;
  estado: boolean;
  teacherSubjectRequestDto?: TeacherSubjectResponseDto[];
  teacherCourseResponseDto?: TeacherCourseResponseDto[];
}
