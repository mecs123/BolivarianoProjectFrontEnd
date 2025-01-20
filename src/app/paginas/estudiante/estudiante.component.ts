import { Component } from '@angular/core';
import { Persona } from '../../interfaces/Persona';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from '../../componentes/header/header.component';
import { MenuComponent } from '../../componentes/menu/menu.component';
import { GridComponent } from '../shared/grid/grid.component';

@Component({
  selector: 'app-estudiante',
  imports: [
     MenuComponent,
         HeaderComponent,
         MatTableModule,
         MatPaginatorModule,
         GridComponent
  ],
  templateUrl: './estudiante.component.html',
  styles: ``
})
export class EstudianteComponent {

   estudiantes: Persona[] = [
      { id: 1, nombre: 'Juan Pérez', correo: 'juan@uni.edu', estado: 'Activo' },
      { id: 2, nombre: 'María López', correo: 'maria@uni.edu', estado: 'Inactivo' },
    ];
}
