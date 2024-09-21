import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule,DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-dialogo-editar-fecha',
  standalone: true,
  templateUrl: './dialogo-editar-fecha.component.html',
  styleUrls: ['./dialogo-editar-fecha.component.css'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
  ],
  providers: [ 
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // o el idioma preferido
   
  ],
})
export class DialogoEditarFechaComponent {
  form: FormGroup;
  fechaMinima: Date;

  constructor(
    public dialogRef: MatDialogRef<DialogoEditarFechaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [data.id],
      fecha: [moment(data.fecha, 'YYYY-MM-DD').toDate(), Validators.required],
      titulo: [data.titulo, Validators.required] // Añadir campo para el título

    });
    this.fechaMinima = new Date();
  }
 
  onNoClick(): void {
    this.dialogRef.close();
  }
}
