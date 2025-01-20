import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { AssingProfesorComponent } from "../../profesores/assing-profesor/assing-profesor.component";

@Component({
  selector: 'app-banner',
  imports: [MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule, AssingProfesorComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  showForm: boolean = false;
  showStepper: boolean = false;

  toggleForm() {
    this.showForm = !this.showForm;
    console.log("showForm toggled: ", this.showForm); // Verificar en consola
  }

  toggleStepper(): void {
    this.showStepper = !this.showStepper;
    console.log("showStepper toggled:presiono el boton ", this.showStepper); // Verificar en consola
  }



}
