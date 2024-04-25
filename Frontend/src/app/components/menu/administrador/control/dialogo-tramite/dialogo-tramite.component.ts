import { CommonModule, NgFor } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ProyectoyproductoService } from "../../../services/proyectoyproducto";


@Component({
  selector: 'app-dialogo-tramite',
  standalone: true,
  templateUrl: './dialogo-tramite.component.html',
  styleUrls: ['./dialogo-tramite.component.css'],
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
  ],
})
export class DialogoTramiteComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  hide = true;
  estadoProcesoData!: string;
  registroForm: any;


  estadosProceso: string[] = [
    'Aprobado',
    'Rechazado',
    'Corregir',
    'Espera'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      type: string,
      data: any,
    },
    private formBuilder: FormBuilder,
    private proyectoyproductoService: ProyectoyproductoService,
    private readonly dialogRef: MatDialogRef<DialogoTramiteComponent>
  ) { }

  async ngOnInit() {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;

    this.registroForm = this.formBuilder.group({
      estadoProceso: [this.data?.estadoProceso, [Validators.required]],
      observacion: [this.data?.observacion, [Validators.required]],
    });
    this.estadoProcesoData = this.data?.estadoProceso;
  }

  get estadoProceso() {
    return this.registroForm.get('estadoProceso');
  }
  get observacion() {
    return this.registroForm.get('observacion');
  }

  guardarTramite() {
    if (this.registroForm.valid) {
      const tramiteGeneral = this.data;
      tramiteGeneral.estadoProceso = this.estadoProceso?.value;
      tramiteGeneral.observacion = this.observacion?.value;
      if(this.type === 'Proyecto') {
        this.proyectoyproductoService.actualizarProyecto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado la observacion:', resp);
            this.registroForm.reset();
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      } else {
        this.proyectoyproductoService.actualizarProducto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado la observacion:', resp);
            this.registroForm.reset();
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      }
    }
  }

}
