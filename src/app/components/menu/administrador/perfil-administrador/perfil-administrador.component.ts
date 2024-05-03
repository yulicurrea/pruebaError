import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../services/autenticacion';
import { InvestigadorService} from "../../services/registroInvestigador";
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UsuarioSesion } from '../../modelo/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-administrador',
  templateUrl: './perfil-administrador.component.html',
  styleUrls: ['./perfil-administrador.component.css'],
  standalone: true,
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class PerfilAdministradorComponent  implements OnInit {
  userData: any;
  firstFormGroup: any;
  tipodpcumento: string[] = [
    'CC',
    'TI',
    'CE',
    'RC',
    'PA'
  ];
  inputDeshabilitado: boolean = true;
  imagenURL: string = 'https://ps.w.org/simple-user-avatar/assets/icon-256x256.png';
  urlDeLaImagen: string = this.imagenURL;
  usuarioSesion!: UsuarioSesion;

  constructor(
    private autenticacionService: AutenticacionService, 
    private investigadorService: InvestigadorService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.obtenerDatosUsuarioSesion();
    this.investigadorService.getUsuarioDetail(this.usuarioSesion.numerodocumento).subscribe(
      (data) => {
        this.userData = data;
        this.firstFormGroup = this.formBuilder.group({
          numerodocumento: [{value: this.userData?.numerodocumento, disabled: true }, [Validators.required]],
          nombre: [{value: this.userData.nombre, disabled: this.inputDeshabilitado}, [Validators.required]],
          apellidos: [{value: this.userData.apellidos, disabled: this.inputDeshabilitado },[Validators.required]],
          correo: [{value: this.userData?.correo, disabled: this.inputDeshabilitado },[Validators.required]],
          tipodocumento: [{value: this.userData?.tipodocumento, disabled: this.inputDeshabilitado }, [Validators.required]],
          escalofonodocente: [{value: this.userData?.escalofonodocente, disabled: this.inputDeshabilitado },[Validators.required]],
          horariosestrictos: [{value: this.userData?.horasestricto, disabled: this.inputDeshabilitado},[Validators.required]],
          horariosformacion: [{value: this.userData?.horasformacion, disabled: this.inputDeshabilitado},[Validators.required]],
          lineainvestigacion: [{value: this.userData?.lineainvestigacion, disabled: this.inputDeshabilitado},[Validators.required]],
          unidadacademica: [{value: this.userData?.unidadAcademica, disabled: this.inputDeshabilitado},[Validators.required]],
        });
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerDatosUsuarioSesion(){
    this.usuarioSesion = this.autenticacionService.obtenerDatosUsuario();
  }

  get numerodocumento() {
    return this.firstFormGroup.get('numerodocumento');
  }
  get nombre() {
    return this.firstFormGroup.get('nombre');
  }
  get apellidos() {
    return this.firstFormGroup.get('apellidos');
  }
  get correo() {
    return this.firstFormGroup.get('correo');
  }
  get tipodocumento() {
    return this.firstFormGroup.get('tipodocumento');
  }
  get escalofonodocente() {
    return this.firstFormGroup.get('escalofonodocente');
  }
  get horariosestrictos() {
    return this.firstFormGroup.get('horariosestrictos');
  }
  get horariosformacion() {
    return this.firstFormGroup.get('horariosformacion');
  }
  get lineainvestigacion() {
    return this.firstFormGroup.get('lineainvestigacion');
  }
  get unidadacademica() {
    return this.firstFormGroup.get('unidadacademica');
  }

  activarInput() {
    this.inputDeshabilitado = false;
    this.ngOnInit();
  }

  desactivarInput() {
    this.inputDeshabilitado = true;
    this.ngOnInit();
  }

  guardarDatos() {
    if (this.firstFormGroup.valid) {
      const tramiteGeneral = this.firstFormGroup.value;
      tramiteGeneral.numerodocumento = this.usuarioSesion.numerodocumento;
      console.log(' guardarDatos => ',tramiteGeneral);
      this.investigadorService.actualizarInvestigador(tramiteGeneral).subscribe(
        (resp) => {
          Swal.fire({
            title: 'Registro Exitoso !!!',
            text: 'Se ha editado el perfil',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.inputDeshabilitado = true;
          this.ngOnInit();
        },
        (error) => {
          console.error('Error al notificar:', error);
        }
      );
    }
  }
}
