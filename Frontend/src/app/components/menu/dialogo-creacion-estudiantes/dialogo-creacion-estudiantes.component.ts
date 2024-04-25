import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { Estudiantes } from '../modelo/proyectos';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EstudiantesService } from '../services/estudiantes';

@Component({
  selector: 'app-dialogo-creacion-estudiantes',
  standalone: true,
  templateUrl: './dialogo-creacion-estudiantes.component.html',
  styleUrl: './dialogo-creacion-estudiantes.component.css',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatDatepickerModule
  ],

})
export class DialogoCreacionEstudiantesComponent implements OnInit  {

  buttonTitle!: string;
  title!: string;
  public registroForm: FormGroup;
  hide = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
    },
    private formBuilder: FormBuilder,
    private estudiantesService: EstudiantesService,
    private readonly dialogRef: MatDialogRef<DialogoCreacionEstudiantesComponent>
  ) { 
    this.registroForm = this.formBuilder.group({
      numeroDocumento: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      semestre: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      codigoGrupo: ['', [Validators.required]],
      fechaGrado: ['', [Validators.required]],
    });
  }

  tipoDocumentoData: any[] = [
    {value: 'CC', viewValue: 'Cédula de ciudadanía'},
    {value: 'TI', viewValue: 'Tarjeta de identidad'},
    {value: 'CE', viewValue: 'Cédula de extrangería'},
    {value: 'RC', viewValue: 'Registro civilra'},
    {value: 'PA', viewValue: 'Pasaporte'},
  ];

  async ngOnInit() {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
  }

  get numeroDocumento() {
    return this.registroForm.get('numeroDocumento');
  }
  get nombres() {
    return this.registroForm.get('nombres');
  }
  get apellidos() {
    return this.registroForm.get('apellidos');
  }
  get semestre() {
    return this.registroForm.get('semestre');
  }
  get tipoDocumento() {
    return this.registroForm.get('tipoDocumento');
  }
  get codigoGrupo() {
    return this.registroForm.get('codigoGrupo');
  }
  get fechaGrado() {
    return this.registroForm.get('fechaGrado');
  }

  guardarUsuario() {
    if (this.registroForm.valid) {
      const estudiante: Estudiantes = {
        numeroDocumento: this.numeroDocumento?.value,
        tipoDocumento: this.tipoDocumento?.value,
        nombres: this.nombres?.value,
        apellidos: this.apellidos?.value,
        semestre: this.semestre?.value,
        codigoGrupo: this.codigoGrupo?.value,
        fechaGrado: this.fechaGrado?.value,
      };
      this.estudiantesService.crearEstudiante(estudiante).subscribe(
        (resp) => {
          console.log('Se ha registrado el usuario exitosamente:', resp);
          this.registroForm.reset();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al registrar el usuario:', error);
        }
      );
    }
  }
}
