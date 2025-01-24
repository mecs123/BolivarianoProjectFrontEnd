import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserResponse } from '../interfaces/response/UserResponse';
import { TeacherResponseDTO } from '../interfaces/profesor/response/TeacherResponseDTO';
import { UpdateTeacherRequest } from '../interfaces/profesor/request/TeacherRequestDTO';
@Injectable({
  providedIn: 'root'
})
export class ProfesorService {


  constructor(private _http:HttpClient ) { }

  //baseUrl= "http://localhost:8080/teacher";
  baseUrl= "http://localhost:8087/teacher/all";
  getAllProfesores(): Observable<any> {
    const token = localStorage.getItem('authToken');  // Recupera el token almacenado

    // Configurar el encabezado con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.get(`${this.baseUrl}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener profesores:', error);
        return throwError(() => new Error('Error al obtener profesores'));
      })
    );
  }

  baseUrlById= "http://localhost:8087/teacher/";
  getProfesorById(id:any): Observable<TeacherResponseDTO> {
    const token = localStorage.getItem('authToken');  // Recupera el token almacenado

    // Configurar el encabezado con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.get<TeacherResponseDTO>(`${this.baseUrlById}${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener profesores:', error);
        return throwError(() => new Error('Error al obtener profesores'));
      })
    );
  }

  baseUrlUpdate = 'http://localhost:8087/teacher-assign/';

  updateProfesor(id: number, teacherData: UpdateTeacherRequest): Observable<TeacherResponseDTO> {
  const token = localStorage.getItem('authToken');  // Recupera el token almacenado

  // Configurar el encabezado con el token
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this._http.put<TeacherResponseDTO>(
    `${this.baseUrlUpdate}${id}`,  // URL con el ID del profesor
    teacherData,                  // Aquí se pasan los datos del profesor
    { headers }                   // Los encabezados se pasan aquí
  ).pipe(
    catchError((error) => {
      console.error('Error al actualizar el profesor:', error);
      return throwError(() => new Error('Error al actualizar el profesor'));
    })
  );
}


delete(id: number): Observable<any> {
  const url = `http://localhost:8087/teacher/${id}`;
  return this._http.delete<any>(url, {
    headers: { 'Content-Type': 'application/json' }
    });
}









}
