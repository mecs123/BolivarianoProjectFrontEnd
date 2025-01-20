import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-generic-banner',
  imports: [

    MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        CommonModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDividerModule,
        MatButtonModule,
  ],
  templateUrl: './generic-banner.component.html',
  styleUrl: './generic-banner.component.css'
})
export class GenericBannerComponent {

  @Input() title: string = '';           // Título dinámico
  @Input() buttonText: string = '';      // Texto del botón
  @Input() component!: Type<any>;        // Componente dinámico

  showComponent: boolean = false;

  toggleComponent(): void {
    this.showComponent = !this.showComponent;
  }
}
