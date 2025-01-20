export interface TeacherSubjectRequestDto {
  idSubject: number;
  nameSubject: string;
}

export interface TeacherCourseResponseDto {
  idCourse: number;
  nameCourse: string;
}

export interface Teacher {
  id: number;
  nameTeacher: string;
  codTeacher: string;
  estado: boolean;
  teacherSubjectRequestDto: TeacherSubjectRequestDto[];
  teacherCourseResponseDto: TeacherCourseResponseDto[];
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface ApiResponse {
  mensaje: string;
  codigoError: string;
  body: {
    content: Teacher[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}
