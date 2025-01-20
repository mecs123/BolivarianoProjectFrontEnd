// src/app/models/user.model.ts
export interface Persona {
  id: number;
  nombre: string;
  correo: string;
  estado: 'Activo' | 'Inactivo';
}
