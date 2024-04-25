import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import * as moment from 'moment';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvestigadorService } from '../../../services/registroInvestigador';
import { UsuarioSesion } from '../../../modelo/usuario';
import { AutenticacionService } from '../../../services/autenticacion';

@Component({
  selector: 'app-dialogo-avance-entregable',
  standalone: true,
  templateUrl: './dialogo-avance-entregable.component.html',
  styleUrls: ['./dialogo-avance-entregable.component.css'],
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
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    AsyncPipe,
    HttpClientModule,
    MatListModule,
    MatTooltipModule
  ],
})
export class DialogoAvanceEntregableComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  origin!: any;
  admin!: boolean;
  hide = true;
  estadoProcesoData!: string;
  registroForm: any;
  proyectosData: any[] = [];
  productosData: any[] = [];
  estadoProcesoSelected!: string;
  demo1TabIndex!: number;

  tipoAvance = 'Url';
  opcionAvance: string[] = ['Url', 'Adjunto'];
  selectedFile: File = null!;

  estadosProceso: any[] = [
    {value: 'Aprobado', viewValue: 'Aprobado'},
    {value: 'Rechazado', viewValue: 'Rechazado'},
    {value: 'Corregir', viewValue: 'Corregir'},
    {value: 'Espera', viewValue: 'Espera'},
  ];

  @ViewChild('fileUpload')
  fileUpload!: ElementRef

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      type: string,
      data: any,
      origin: any,
      admin: boolean,
    },
    private formBuilder: FormBuilder,
    private proyectoyproductoService: ProyectoyproductoService,
    private investigatorService: InvestigadorService,
    private AutenticacionService:AutenticacionService,
    private readonly dialogRef: MatDialogRef<DialogoAvanceEntregableComponent>
  ) { }

  ngOnInit(): void {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;
    this.admin = this.dialogData.admin;
    this.origin = this.dialogData.origin;

    if(this.admin) {
      this.demo1TabIndex = 1;
      this.estadoProcesoSelected = this.data?.estadoProceso;
      this.registroForm = this.formBuilder.group({
        estadoProceso: [this.data?.estadoProceso, Validators.required],
        observacion: ['', Validators.required],
        estado: [this.data?.estado, Validators.required],
      });
    } else {
      this.registroForm = this.formBuilder.group({
        url: [{value:'', disabled: !this.data?.estado} ],
        soporte: ['',this.selectedFile],
      });
    }

    this.estadoProcesoData = this.data?.estadoProceso;
    if(this.type === 'Proyecto') {
      this.obtenerEntregableProyecto();
    } else {
      this.obtenerEntregableProducto();
    }
    this.obtenerUsuarios();
    this.obtenerDatosUsuarioSesion();
  }

  usuarioSesion!: UsuarioSesion;
  obtenerDatosUsuarioSesion(){
    this.usuarioSesion = this.AutenticacionService.obtenerDatosUsuario();
  }

  radioChange(event:any):void {
    this.tipoAvance = event.value;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  obtenerEntregableProyecto(){
    this.proyectoyproductoService.obtenerAvancesProyecto().subscribe((data) => {    
      this.proyectosData = data.reverse().filter(proyecto => proyecto.configuracionEntregableProyecto_id === this.data?.id);
    });
  }

  obtenerEntregableProducto(){
    this.proyectoyproductoService.obtenerAvancesProducto().subscribe((data) => {    
      this.productosData = data.reverse().filter(producto => producto.configuracionEntregableProducto_id === this.data?.id);
    });
  }

  get estadoProceso() {
    return this.registroForm.get('estadoProceso');
  }
  get observacion() {
    return this.registroForm.get('observacion');
  }
  get estado() {
    return this.registroForm.get('estado');
  }

  get soporte() {
    return this.registroForm.get('soporte');
  }
  get url() {
    return this.registroForm.get('url');
  }

  guardarTramite() {
    if(this.admin){
      this.actualizarEntregable();
    } else {
      if(this.url?.value !== "" || this.selectedFile !== null){
        this.registrarAvance();
      }
    }
  }

  registrarAvance(): void {
    if (this.registroForm.valid) {
      if(this.type === 'Proyecto') {
        const tramiteGeneral = {
          soporte: this.selectedFile,
          url: this.url?.value,
          fecha: moment(new Date()).format('YYYY-MM-DD'),
          estado: 'True',
          configuracionEntregableProyecto_id_id: this.data?.id,
        };
        this.proyectoyproductoService.avanceEntregablesProyecto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado el avance:', resp);
            this.registroForm.reset();
            this.notificar(
              `Proyecto ${this.data?.proyecto_id} - Nuevo Avance`,
              this.origin?.investigador,
              this.usuariosAdmin,
              `Se ha configurado un nuevo avance al entregable ${this.data?.descripcion} del proyecto ${this.data?.proyecto_id}`
            );
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      } else {
        const tramiteGeneral = {
          soporte: this.selectedFile,
          url: this.url?.value,
          fecha: moment(new Date()).format('YYYY-MM-DD'),
          estado: 'True',
          configuracionEntregableProducto_id_id: this.data?.id,
        };
        this.proyectoyproductoService.avanceEntregablesProducto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado el avance:', resp);
            this.registroForm.reset();
            this.notificar(
              `Producto ${this.data?.producto_id} - Nuevo Avance`,
              this.origin?.investigador,
              this.usuariosAdmin,
              `Se ha configurado un nuevo avance al entregable ${this.data?.descripcion} del proyecto ${this.data?.producto_id}`
            );
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      }
    }
  }

  actualizarEntregable(): void {
    const tramiteGeneral = {
      estadoProceso: this.estadoProceso?.value,
      observacion: this.observacion?.value,
      estado: this.estado?.value,
      id: this.data?.id,
    };
    if(this.type === 'Proyecto') {
      this.proyectoyproductoService.actualizarEntregableProyecto(tramiteGeneral).subscribe(
        (resp) => {
          console.log('Se ha evaluado el avance:', resp);
          this.notificarClasificacion(
            `Proyecto ${this.data?.proyecto_id} - Calificación Avance`,
            this.usuarioSesion.numerodocumento,
            this.origin?.investigador,
            `El avance del entregable ${this.data?.descripcion} ha sido evaluado con el estado ${tramiteGeneral.estadoProceso}`
          );
          this.registroForm.reset();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al notificar:', error);
        }
      );
    } else {
      this.proyectoyproductoService.actualizarEntregableProducto(tramiteGeneral).subscribe(
        (resp) => {
          console.log('Se ha registrado el avance:', resp);
          this.notificarClasificacion(
            `Producto ${this.data?.producto_id} - Calificación Avance`,
            this.usuarioSesion.numerodocumento,
            this.origin?.investigador,
            `El avance del entregable ${this.data?.descripcion} ha sido evaluado con el estado ${tramiteGeneral.estadoProceso}`
          );
          this.registroForm.reset();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al notificar:', error);
        }
      );
    }
  }

  usuariosAdmin: any[] = [];
  obtenerUsuarios(){
    this.investigatorService.getUsuarios().subscribe((data) => {   
      const usersAdmin = data.filter(u => u.rolinvestigador === 'Administrador');
      usersAdmin.forEach(element => {
        this.usuariosAdmin.push(element.numerodocumento);
      });
    });
  }

  notificar(asunto:string,remitente:any,destinatario:string[],mensaje:string):void {
    destinatario.forEach(admin => {
      const notificacion = {
        asunto: asunto,
        remitente: remitente,
        destinatario: admin,
        mensaje: mensaje
      }
      this.proyectoyproductoService.notificar(notificacion).subscribe(
        (resp: any) => {
          console.log('Se ha notificado exitosamente:', resp);
        },
        (error: any) => {
          console.error('Error al notificado el proyecto:', error);
        }
      );
    });
  }

  notificarClasificacion(asunto:string,remitente:any,destinatario:string[],mensaje:string):void {
    const notificacion = {
      asunto: asunto,
      remitente: remitente,
      destinatario: destinatario,
      mensaje: mensaje
    }
    this.proyectoyproductoService.notificar(notificacion).subscribe(
      (resp: any) => {
        console.log('Se ha notificado exitosamente:', resp);
      },
      (error: any) => {
        console.error('Error al notificado el proyecto:', error);
      }
    );
  }

}
