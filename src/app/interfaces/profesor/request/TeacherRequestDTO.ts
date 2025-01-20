export interface TeacherSubject {
  idSubject?: number;
  nameSubject?: string;
}

export interface TeacherCourse {
  idCourse?: number;
  nameCourse?: string;
}

export interface UpdateTeacherRequest {
  codTeacher?: string;
  nameTeacher?: string;
  estado?: boolean;
  teacherSubjectRequestDto?: TeacherSubject[];
  teacherCourseRequestDto?: TeacherCourse[];
}
