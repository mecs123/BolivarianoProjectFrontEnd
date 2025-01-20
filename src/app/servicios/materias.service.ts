import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { UserResponse } from '../interfaces/response/UserResponse';
@Injectable({
  providedIn: 'root'
})
export class MateriasService {


  constructor(private _http:HttpClient ) { }

  //baseUrl= "http://localhost:8080/teacher";
  baseUrl= "http://localhost:8082/subject/all";
  getAllMaterias(): Observable<any> {
    const token = localStorage.getItem('authToken');  // Recupera el token almacenado

    // Configurar el encabezado con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this._http.get(`${this.baseUrl}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener las materias:', error);
        return throwError(() => new Error('Error al obtener materias'));
      })
    );
  }





   // Método para registrar un nuevo usuario

   register(modelo: any): Observable<any> {
    return this._http.post(`${environment.api}/sign-up`, modelo, {
      headers: { 'Content-Type': 'application/json' },
    });
  }



  // Método para editar un usuario (como ejemplo)
  editUser(userRequest: any): Observable<UserResponse> {
    const url = `http://localhost:8095/auth/edit/${userRequest.id}`;
  return this._http.put<any>(url, userRequest, {
    headers: { 'Content-Type': 'application/json' }
  });

}

delete(id: number): Observable<any> {
  const url = `http://localhost:8095/auth/delete/${id}`;
  return this._http.delete<any>(url, {
    headers: { 'Content-Type': 'application/json' }
    });
}

getUserById(id:any): Observable<any> {
  return this._http.get(`${environment.api}/byId/${id}`).pipe(
    catchError((error) => {
      console.error('Error al obtener usuarios:', error);
      return throwError(() => new Error('Error al obtener usuarios'));
    })
  );
}






}
