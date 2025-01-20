import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserResponse } from '../interfaces/response/UserResponse';
@Injectable({
  providedIn: 'root'
})

export class FormDataService  {

    private _http = inject(HttpClient);  // Inyección directa

    // URLs directas
    private baseUrlCourse = 'http://localhost:8084/courses/all';
    private baseUrlSubject = 'http://localhost:8082/subject/all';
    private emailUrl = 'http://localhost:8095/auth/email';

    constructor() {}

    // Método reutilizable para obtener encabezados con token
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('authToken') || '';
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }

    // Manejo de errores centralizado
    private handleError(message: string) {
      return (error: any) => {
        console.error(message, error);
        return throwError(() => new Error(message));
      };
    }

    // Obtener usuario por correo
    getUserEmail(email: string): Observable<UserResponse> {
      const url = `${this.emailUrl}?email=${email}`;
      return this._http.get<UserResponse>(url).pipe(
        catchError(this.handleError('Error al obtener el correo, contacte al ADMIN'))
      );
    }

    // Obtener todos los cursos
    getAllCourseToSelectTeacher(): Observable<any> {
      return this._http.get(this.baseUrlCourse, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleError('Error al obtener cursos'))
      );
    }

    // Obtener todas las materias
    getAllSubjectToSelectTeacher(): Observable<any> {
      return this._http.get(this.baseUrlSubject, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleError('Error al obtener materias'))
      );
    }


    // Método para enviar los datos del profesor
    saveTeacherData(data: any): Observable<any> {
      const url = 'http://localhost:8087/teacher';  // Endpoint del backend
      return this._http.post(url, data, { headers: this.getAuthHeaders() }).pipe(
        catchError(this.handleError('Error al guardar el profesor'))
      );
    }


  }
