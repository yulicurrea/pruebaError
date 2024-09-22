import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutenticacionService } from '../../services/autenticacion';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UsuarioSesion } from '../../modelo/usuario';
import { InvestigadorService } from '../../services/registroInvestigador';
import Swal from 'sweetalert2';
import { DialogoCargaEstudiosComponent } from './dialogo-carga-estudios/dialogo-carga-estudios.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-perfil-investigador',
  templateUrl: './perfil-investigador.component.html',
  styleUrls: ['./perfil-investigador.component.css'],
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
    MatNativeDateModule,
    MatIconModule
  ],
})
export class PerfilInvestigadorComponent implements OnInit {
  userData: any;
  firstFormGroup: any;
  tipodpcumento: string[] = [
    'CC',
    'TI',
    'CE',
    'RC',
    'PA'
  ];
  lineainvestigacion1: string[] = [
    'Ingeniería de software y sociedad',
    'Ingeniería para la salud y el desarrollo biológico',
    'Ingeniería y educación',
    'Ingeniería para la sostenibilidad de sistemas naturales'];
  unidadAcademica1: string [] =[
    'Facultad de Ingeniería',
    'Facultad de Ciencias',
    'Facultad de Educación',
  ]; 
  inputDeshabilitado = true; 
  imagenUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  usuarioSesion!: UsuarioSesion;
  pregradoData: any[] = [];
  posgradoData: any[] = [];

  constructor(
    private autenticacionService: AutenticacionService,
    private investigadorService: InvestigadorService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.firstFormGroup = this.formBuilder.group({
      numerodocumento: [{ value: '', disabled: true }, Validators.required],
      nombre: [{ value: '', disabled: this.inputDeshabilitado }, [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      apellidos: [{ value: '', disabled: this.inputDeshabilitado }, [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      correo: [{ value: '', disabled: this.inputDeshabilitado },[ Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@unbosque\.edu\.co')]],
      tipodocumento: [{ value: '', disabled: this.inputDeshabilitado }, Validators.required],
      escalofonodocente: [{ value: '', disabled: this.inputDeshabilitado }, [Validators.required, Validators.pattern('[A-Za-z ]+')]],
      horasestricto: [{ value: '', disabled: this.inputDeshabilitado }, [Validators.required, Validators.pattern('^[0-9]*$')]],
      horasformacion: [{ value: '', disabled: this.inputDeshabilitado }, [Validators.required, Validators.pattern('^[0-9]*$')]],
      lineainvestigacion: [{ value: '', disabled: this.inputDeshabilitado },Validators.required],
      unidadAcademica: [{ value: '', disabled: this.inputDeshabilitado },Validators.required],
      imagen: [{ value: '', disabled: this.inputDeshabilitado }]
    });    
  }

  ngOnInit(): void {
    console.log(this.userData);
    console.log(this.lineainvestigacion1);
    this.obtenerDatosUsuarioSesion();
    this.obtenerPregrado();
    this.obtenerPosgrado();
    this.investigadorService.getUsuarioDetail(this.usuarioSesion.numerodocumento).subscribe(
      (data) => {
        this.userData = data;
        if (this.userData) {
          this.firstFormGroup.setValue({
            numerodocumento: this.userData?.numerodocumento || '',
            nombre: this.userData.nombre || '',
            apellidos: this.userData.apellidos || '',
            correo: this.userData?.correo || '',
            tipodocumento: this.userData?.tipodocumento || '',
            escalofonodocente: this.userData?.escalofonodocente || '',
            horasestricto: this.userData?.horasestricto || '0',
            horasformacion: this.userData?.horasformacion || '0',
            lineainvestigacion: this.userData?.lineainvestigacion || '',
            unidadAcademica: this.userData?.unidadAcademica || '',
            imagen: this.userData.imagen?.imagen || ''
          });
          this.imagenUrl = this.userData.imagen?.imagen;

          if (this.inputDeshabilitado) {
            this.firstFormGroup.disable();
          } else {
            this.firstFormGroup.enable();
            this.firstFormGroup.controls['numerodocumento'].disable();
          }
        } else {
          console.error('userData es undefined o null');
        }
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  defaultImageUrl: string = 'assets/img/imagen.jpg';
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image')) {
        alert('Por favor, seleccione un archivo de imagen válido.');
        return;
      }
      this.selectedFile = file; // Asigna el archivo seleccionado a selectedFile
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  obtenerDatosUsuarioSesion() {
    this.usuarioSesion = this.autenticacionService.obtenerDatosUsuario();
  }
 
  obtenerPregrado(){
    this.investigadorService.obtenerPregrado().subscribe(
      (data) => {
        this.pregradoData = data.filter((x: { Investigador_id: string; }) => x.Investigador_id == this.usuarioSesion.numerodocumento);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  obtenerPosgrado(){
    this.investigadorService.obtenerPosgrado().subscribe(
      (data) => {
        this.posgradoData = data.filter((x: { Investigador_id: string; }) => x.Investigador_id == this.usuarioSesion.numerodocumento);
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
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
  get horasestricto() {
    return this.firstFormGroup.get('horasestricto');
  }
  get horasformacion() {
    return this.firstFormGroup.get('horasformacion');
  }
  get lineainvestigacion() {
    return this.firstFormGroup.get('lineainvestigacion');
  }
  get unidadAcademica() {
    return this.firstFormGroup.get('unidadAcademica');
  }

  openDialogoDetalle(tipo:string): void {
    const dialogRef = this.dialog.open(DialogoCargaEstudiosComponent, {
      data: {
        title: 'Nuevo '+tipo,
        type:tipo,
        numerodocumento: this.usuarioSesion.numerodocumento,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado el registro de estudio',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        console.log('result',result);
      } 
    });
  }


  activarInput() {
    this.inputDeshabilitado = false;
    this.firstFormGroup.enable();
    this.firstFormGroup.get('numerodocumento')?.disable();
  }
  
  

  desactivarInput() {
    this.inputDeshabilitado = true;
    this.firstFormGroup.get('nombre')?.disable();
    this.firstFormGroup.get('apellidos')?.disable();
    this.firstFormGroup.get('correo')?.disable();
    this.firstFormGroup.get('tipodocumento')?.disable();
    this.firstFormGroup.get('escalofonodocente')?.disable();
    this.firstFormGroup.get('horasestricto')?.disable();
    this.firstFormGroup.get('horasformacion')?.disable();
    this.firstFormGroup.get('lineainvestigacion')?.disable();
    this.firstFormGroup.get('unidadAcademica')?.disable();
  }

  guardarDatos() {
    if (this.firstFormGroup.valid) {
      const tramiteGeneral = this.firstFormGroup.value;
      tramiteGeneral.numerodocumento = this.usuarioSesion.numerodocumento;
  
      if (this.selectedFile) {
        tramiteGeneral.imagen = this.selectedFile;
      }
      console.log(' guardarDatos => ',tramiteGeneral);
      this.investigadorService.actualizarInvestigador(tramiteGeneral).subscribe(
        () => {
          Swal.fire({
            title: 'Registro Exitoso !!!',
            text: 'Se ha editado el perfil',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.desactivarInput();
        },
        (error) => {
          console.error('Error al actualizar el investigador:', error);
        }
      );
    }
  }
}
