import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuComponent } from "../../componentes/menu/menu.component";
import { HeaderComponent } from "../../componentes/header/header.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../servicios/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthCreateUserRequest } from '../../interfaces/request/AuthCreateUserRequest';
import { AuthResponse } from '../../interfaces/response/AuthResponse';
import Swal from 'sweetalert2';
import { AuthEditarUserRequest } from '../../interfaces/request/AuthEditarUserRequest';

@Component({
  selector: 'app-usuarios',
  imports: [
    MenuComponent,
    HeaderComponent,
    RouterLink,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuarios.component.html',
  // styleUrls: ['./usuarios.component.css'],
  styles: ``
})
export class UsuariosComponent implements OnInit {

  datos: any = [];
  roles: any = [];
  rolesAsignados: string[] = [];
  selectedRoles: number[] = [];
  getAllDataById:any =[]
  roleById: any = [];
  isRoleRequestInvalid:boolean = false;
  modalTitle!: string;
  modelo: any;
  userForm: any = FormGroup;

  @ViewChild("myModalConfig", { static: false }) myModalConfig!: TemplateRef<any>;



  constructor(
    private usuariosServices: UsuariosService,
    private modalService: NgbModal,
     private fb: FormBuilder
    ) {

    }

    passwordVisible: boolean = false; // Variable para controlar la visibilidad

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Cambiar el estado de visibilidad
  }

  ngOnInit(): void {
    this.loadUsers();


  }


  onSubmit(): void {
    this.initializeForm();


  }



  private initializeForm(isEditMode: boolean = false): void {

    const validators = isEditMode ? [] : [Validators.required];  // Si es edición, no requiere validación de campo obligatorio

    this.userForm = this.fb.group({
      id: [''],   // Asegúrate de que esté incluido en el formulario
      username: ['', ...validators],  // Se valida solo en creación
      password: [''],  // Se valida solo en creación
      roleRequest: [[], ...validators], // Se valida solo en creación
      fullName: ['', ...validators],  // Se valida solo en creación
      email: ['', ...validators],  // Se valida solo en creación
      dateOfBirth: ['', ...validators],  // Se valida solo en creación
      phone: ['', ...validators],  // Se valida solo en creación
      isEnabled: ['', ...validators],  // Se valida solo en creación
      accountNoExpired: [''],  // No es obligatorio ni en crear ni en editar
      accountNoLocked: ['']   // No es obligatorio ni en crear ni en editar
    });
  }


  loadingHeadModal(nameModal:string): void {
    this.modalTitle = nameModal;
    this.modalService.open(this.myModalConfig, { size: 'lg' });

  }

  crear() {
    this.loadingHeadModal('Crear');
    this.initializeForm(true);
    this.loadRoles()
  }

    /**
   * Carga todos los usuarios desde el servicio.
   */
    private loadUsers(): void {
      this.usuariosServices.getAllUsuarios().subscribe({
        next: (data) => {
          this.datos = data;

        },
        error: (error) => {
          console.error('No se pudieron obtener los datos:', error);
        },
      });
    }

    private loadRoles(): void {
      this.usuariosServices.getAllRoels().subscribe({
        next: (data) => {
          this.roles = data;

        },
        error: (error) => {
          console.error('No se pudieron obtener los datos:', error);
        },
      });
    }


  /**
   * Llama al servicio para registrar al usuario.
   */
 private registerUser(userRequest: AuthCreateUserRequest): void {
  this.usuariosServices.register(userRequest).subscribe({
    next: (response) => this.onRegisterSuccess(response),
    error: (error) => this.onRegisterError(error),
  });

  }


  enviar() {
    if (this.userForm.valid) {
      const userRequest = this.createOrUpdateUserRequest();

      this.registerUser(userRequest); // Llamada al servicio
    } else {

      // Recorrer todos los controles y mostrar los errores de cada control
      Object.keys(this.userForm.controls).forEach(controlName => {
        const control = this.userForm.get(controlName);
        if (control && control.errors) {
          console.log(`Errores en ${controlName}:`, control.errors);
        }
      });
    }
  }



  userRoleById(usuario: AuthEditarUserRequest): void {

    this.usuariosServices.getUserById(usuario.id).subscribe({
      next: (data) => {
        // Asegúrate de que los roles están en el formato esperado
        this.roleById = data.roles;  // Suponiendo que los roles están en 'roles'


      },
      error: (error) => {
        console.error('No se pudieron obtener los datos:', error);
      }
    });
  }


  editUser(usuario: AuthEditarUserRequest): void {
   this.loadingHeadModal('Editar');
   this.initializeForm(false);
   if (!usuario) {
    return;
   }else{

    this.usuariosServices.getUserById(usuario.id).subscribe({
      next: (response) => {
        const usuario = response;  // Accede al primer elemento del array
        this.rolesAsignados = usuario.roles;  // Esto es un array: ['INVITED']
        const titulo = this.modalTitle = 'Editar';
        this.cargarFormularioToShowInUpdate(usuario,titulo);
      },
      error: (error) => console.error(error)
    });



    this.usuariosServices.getAllRoels().subscribe({
      next: (data) => this.roles = data,
      error: (error) => console.error(error)
    });
    }

  }



  cargarFormularioToShowInUpdate(usuario:AuthEditarUserRequest, titulo:string){
    if (!usuario || Object.keys(usuario).length === 0) {
      return;
    }

    this.modalTitle = titulo
    const formattedDate = usuario.dateOfBirth ? new Date(usuario.dateOfBirth).toISOString().split('T')[0] : '';

    this.userForm.patchValue({
      id: usuario.id,  // Asegurarse de que el id se pase explícitamente
      username: usuario.username,
      fullName: usuario.fullName,
      email: usuario.email,
      dateOfBirth: formattedDate,
      phone: usuario.phone,
      isEnabled: usuario.isEnabled,
      accountNoExpired: usuario.accountNoExpired,
      accountNoLocked: usuario.accountNoLocked,
      roleRequest: usuario.roleRequest || [] // Maneja el caso de roleRequest vacío
    });
    console.log("si cargo",this.userForm.value);
  }


  editSendUser(_user: AuthEditarUserRequest): void {
    if(this.userForm.valid){
      const user = this.updateUserRequest(); // Transformar datos
      this.usuariosServices.editUser(user).subscribe({
        next: (response) => this.onEditarSuccess(response),
        error: (error) => this.onRegisterError(error),
      });
     }else{
       console.error('El formulario no es válido');
     }
  }

  viewDetails(user: AuthResponse): void {
    const titulo = this.modalTitle = 'Detalles';
    this.modalService.open(this.myModalConfig, { size: 'lg' });
    this.initializeForm()
    this.usuariosServices.getUserById(user.id).subscribe({
      next: (response) => {
        const usuario = response;  // Accede al primer elemento del array
        this.rolesAsignados = usuario.roles;  // Esto es un array: ['INVITED']

        this.cargarFormularioToShowInUpdate(usuario,titulo);
      },
      error: (error) => console.error(error)
    });
  }

  /**
   * Transforma los datos del formulario en el formato requerido por el backend.
   */
  private createOrUpdateUserRequest(): AuthCreateUserRequest {
      const formValues = this.userForm.value;
      const selectedRoles: string[] = this.userForm.value.roleRequest;
      return {
        id: this.userForm.get('id').value,
        username: formValues.username,
        password: formValues.password,
        fullName: formValues.fullName || '',
        email: formValues.email,
        dateOfBirth: formValues.dateOfBirth,
        phone: formValues.phone,
        isEnabled: formValues.isEnabled,
        accountNoExpired: formValues.accountNoExpired,
        accountNoLocked: formValues.accountNoLocked,
        roleRequest: {
          roleListName:selectedRoles
        }
      };

    }

    private updateUserRequest():  AuthEditarUserRequest {
      const formValues = this.userForm.value;

      return {
        id: this.userForm.get('id').value,
        username: formValues.username,
        fullName: formValues.fullName || '',
        email: formValues.email,
        dateOfBirth: formValues.dateOfBirth,
        phone: formValues.phone,
        isEnabled: formValues.isEnabled,
        accountNoExpired: formValues.accountNoExpired,
        accountNoLocked: formValues.accountNoLocked,
        roleRequest: {
          roleListName:formValues.roleRequest
        }
      };

    }



  /**
   * Maneja el éxito del registro.
   */
  private onRegisterSuccess(response: any): void {
    Swal.fire({
      icon: 'success',
      title: 'Usuario creado',
      text: 'El usuario ha sido creado exitosamente.',
    }).then(() => {
      this.cerrar(); // Cerrar modal tras éxito
      location.reload(); // Recargar la página para mostrar los cambios
    });
  }

    /**
   * Maneja el editar del registro.
   */
    private onEditarSuccess(response: any): void {
      Swal.fire({
        icon: 'success',
        title: 'Usuario Editado',
        text: 'El usuario ha sido editado exitosamente.',
      }).then(() => {
        this.cerrar(); // Cerrar modal tras éxito
        location.reload(); // Recargar la página para mostrar los cambios
      });
    }

  /**
   * Maneja los errores durante el registro.
   */
  private onRegisterError(error: any): void {
    let errorMessage = 'Ha ocurrido un error desconocido.';

    if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos. Por favor, revise los campos del formulario.';
    } else if (error.status === 409) {
      // Accedemos correctamente al error que viene del backend
      const campoError = error.error.campo;
      const mensajeError = error.error.mensaje;

      if (campoError === 'correo') {
        errorMessage = 'El correo ya está registrado. Por favor, usa otro.';
      } else if (campoError === 'nombreUsuario') {
        errorMessage = 'El nombre de usuario ya existe. Intenta con otro.';
      } else {
        errorMessage = mensajeError; // En caso de otros campos
      }
    }

    // Mostrar mensaje de error con SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Error al crear el usuario',
      text: errorMessage,
    });
  }



  eliminar(id: number) {
    this.usuariosServices.delete(id).subscribe({
      next: (response) => this.onDeleteSuccess(response),
      error: (error) => this.onDeleteError(error),
    });
  }



  /**
   * Maneja el éxito del registro.
   */
  private onDeleteSuccess(response: any): void {
    Swal.fire({
      icon: 'success',
      title: 'Usuario Eliminado',
      text: 'El usuario ha sido eliminado exitosamente.',
    }).then(() => {
      this.cerrar(); // Cerrar modal tras éxito
      location.reload(); // Recargar la página para mostrar los cambios
    });
  }

  /**
   * Maneja los errores durante el registro.
   */
  private onDeleteError(error: any): void {
    let errorMessage = 'Ha ocurrido un error desconocido.';

    if (error.status === 500) {
      errorMessage =
        'Error interno del servidor. Es posible que el nombre de usuario no exista. Intente con otro.';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos. Por favor, revise los campos del formulario.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Error al crear el usuario',
      text: errorMessage,
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¡Esta acción no se puede deshacer!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            this.eliminar(id);
        }
    });
}


cerrar(): void {
  // Si tienes una referencia al modal, puedes usar el atributo inert para bloquear la interacción
  const modalElement = document.querySelector('.modal');
  if (modalElement) {
    modalElement.setAttribute('inert', 'true');
  }
  this.modalService.dismissAll();
}

trackById(index: number, item: any): number {
  return item.id;  // Retorna un valor único, generalmente el ID
}



}

