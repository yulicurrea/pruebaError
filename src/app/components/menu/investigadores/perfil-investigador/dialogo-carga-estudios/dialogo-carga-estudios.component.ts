import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InvestigadorService } from '../../../services/registroInvestigador';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dialogo-carga-estudios',
  standalone: true,
  templateUrl: './dialogo-carga-estudios.component.html',
  styleUrls: ['./dialogo-carga-estudios.component.css'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatDatepickerModule,
    CommonModule,
    FormsModule,        
    MatNativeDateModule
  ],
})
export class DialogoCargaEstudiosComponent implements OnInit {

  title!: string;
  type!: string;
  numerodocumento!: string;
  firstFormGroup: any;
  secondFormGroup: any;

  tipoPosgrado: any[] = [
    'Especialización',
    'Maestría',
    'Doctorado',
    'NA',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      type: string,
      numerodocumento: string,
    },
    private readonly dialogRef: MatDialogRef<DialogoCargaEstudiosComponent>,
    private formBuilder: FormBuilder,
    private investigadorService: InvestigadorService,
  ) { 
    
  }

  ngOnInit(): void {
    this.title = this.dialogData.title;
    this.type = this.dialogData.type;
    this.numerodocumento = this.dialogData.numerodocumento;

    if(this.type === 'Pregrado'){
      this.firstFormGroup = this.formBuilder.group({
        titulo: ['', [Validators.required]],
        fecha: ['', [Validators.required]],
        institucion: ['', [Validators.required]],
      });
    } else {
      this.secondFormGroup = this.formBuilder.group({
        titulo2: ['', [Validators.required]],
        fecha2: ['', [Validators.required]],
        institucion2: ['', [Validators.required]],
        tipo2: ['', [Validators.required]],
      });
    }
  }

  get titulo() {
    return this.firstFormGroup.get('titulo');
  }
  get fecha() {
    return this.firstFormGroup.get('fecha');
  }
  get institucion() {
    return this.firstFormGroup.get('institucion');
  }
  get tipo() {
    return this.firstFormGroup.get('tipo');
  }

  get titulo2() {
    return this.secondFormGroup.get('titulo2');
  }
  get fecha2() {
    return this.secondFormGroup.get('fecha2');
  }
  get institucion2() {
    return this.secondFormGroup.get('institucion2');
  }
  get tipo2() {
    return this.secondFormGroup.get('tipo2');
  }

  guardarTramitePregrado() {
    if (this.firstFormGroup !== undefined && this.firstFormGroup.valid) {
      const tramiteGeneral = this.firstFormGroup.value;
      tramiteGeneral.investigadorId = this.numerodocumento;
      tramiteGeneral.fecha =  moment(this.fecha).format('YYYY-MM-DD');
      this.investigadorService.crearPregrado(tramiteGeneral).subscribe(
        (resp) => {
          console.log('Se ha creado el pregrado:', resp);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al notificar:', error);
        }
      );
    }
  }

  guardarTramitePostgrado() {
    const tramiteGeneral = this.secondFormGroup.value;
    tramiteGeneral.investigadorId = this.numerodocumento;
    tramiteGeneral.fecha2 =  moment(this.fecha2).format('YYYY-MM-DD');
    this.investigadorService.crearPosgrado(tramiteGeneral).subscribe(
      (resp) => {
        console.log('Se ha creado el posgrado:', resp);
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al notificar:', error);
      }
    );
  }

}
