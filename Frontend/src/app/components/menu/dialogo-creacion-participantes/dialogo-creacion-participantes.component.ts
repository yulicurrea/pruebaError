import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { ParticipanteExterno } from '../modelo/proyectos';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ParticipantesExternosService } from '../services/participantesExternos';

@Component({
  selector: 'app-dialogo-creacion-participantes',
  standalone: true,
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
  templateUrl: './dialogo-creacion-participantes.component.html',
  styleUrl: './dialogo-creacion-participantes.component.css'
})
export class DialogoCreacionParticipantesComponent implements OnInit {

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
    private participanteExternoService: ParticipantesExternosService,
    private readonly dialogRef: MatDialogRef<DialogoCreacionParticipantesComponent>
  ) { 
    this.registroForm = this.formBuilder.group({
      numerodocumento: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      institucion: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
  }

  get numerodocumento() {
    return this.registroForm.get('numerodocumento');
  }
  get nombre() {
    return this.registroForm.get('nombre');
  }
  get apellidos() {
    return this.registroForm.get('apellidos');
  }
  get institucion() {
    return this.registroForm.get('institucion');
  }

  guardarParticipante() {
    if (this.registroForm.valid) {
      const participante: ParticipanteExterno = {
        numerodocumento: this.numerodocumento?.value,
        nombre: this.nombre?.value,
        apellidos: this.apellidos?.value,
        institucion: this.institucion?.value,
      };
      this.participanteExternoService.crearParticipantesExternos(participante).subscribe(
        (resp) => {
          console.log('Se ha registrado el participante exitosamente:', resp);
          this.registroForm.reset();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al registrar el participante:', error);
        }
      );
    }
  }

}
