import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import * as moment from 'moment';
import { UsuarioSesion } from '../../../modelo/usuario';
import { InvestigadorService } from '../../../services/registroInvestigador';

@Component({
  selector: 'app-dialogo-configuracion-entregable',
  standalone: true,
  templateUrl: './dialogo-configuracion-entregable.component.html',
  styleUrls: ['./dialogo-configuracion-entregable.component.css'],
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
  ],
})
export class DialogoConfiguracionEntregableComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  hide = true;
  estadoProcesoData!: string;
  registroForm: any;
  proyectosData: any[] = [];
  productosData: any[] = [];

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
    private investigatorService: InvestigadorService,
    private readonly dialogRef: MatDialogRef<DialogoConfiguracionEntregableComponent>
  ) { }

  ngOnInit(): void {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;

    this.registroForm = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      estado: [true, [Validators.required]],
    });
    this.estadoProcesoData = this.data?.estadoProceso;

    if(this.type === 'Proyecto') {
      this.obtenerEntregableProyecto();
    } else {
      this.obtenerEntregableProducto();
    }
    this.obtenerUsuarios();

  }

  obtenerEntregableProyecto(){
    this.proyectoyproductoService.obtenerEntregablesProyecto().subscribe((data) => {    
      this.proyectosData = data.reverse().filter(proyecto => proyecto.proyecto_id === this.data?.id);
    });
  }

  obtenerEntregableProducto(){
    this.proyectoyproductoService.obtenerEntregablesProducto().subscribe((data) => {    
      this.productosData = data.reverse().filter(producto => producto.producto_id === this.data?.id);
    });
  }


  get descripcion() {
    return this.registroForm.get('descripcion');
  }
  get fecha() {
    return this.registroForm.get('fecha');
  }
  get estado() {
    return this.registroForm.get('estado');
  }

  guardarTramite() {
    if (this.registroForm.valid) {
      if(this.type === 'Proyecto') {
        const tramiteGeneral = {
          descripcion: this.descripcion?.value,
          fecha: moment(this.fecha?.value).format('YYYY-MM-DD'),
          estado: this.estado?.value,
          estadoProceso: 'Espera',
          observacion: '',
          proyecto_id_id: this.data?.id,
        };
        
        this.proyectoyproductoService.configurarEntregablesProyecto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado el entregable:', resp);
            this.registroForm.reset();
            this.notificar(
              `Proyecto ${this.data?.id} - Nuevo Entregable`,
              this.data?.investigador,
              this.usuariosAdmin,
              `Se ha configurado un nuevo entregable ${tramiteGeneral.descripcion} con plazo ${tramiteGeneral.fecha} al proyecto ${this.data?.id}`
            );
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      } else {
        const tramiteGeneral = {
          descripcion: this.descripcion?.value,
          fecha: moment(this.fecha?.value).format('YYYY-MM-DD'),
          estado: this.estado?.value,
          estadoProceso: 'Espera',
          observacion: '',
          producto_id_id: this.data?.id,
        };
        this.proyectoyproductoService.configurarEntregablesProducto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado el entregable:', resp);
            this.registroForm.reset();
            this.notificar(
              `Producto ${this.data?.id} - Nuevo Entregable`,
              this.data?.investigador,
              this.usuariosAdmin,
              `Se ha configurado un nuevo entregable ${tramiteGeneral.descripcion} con plazo ${tramiteGeneral.fecha} al producto ${this.data?.id}`
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
          console.log('Se ha registrado el proyecto exitosamente:', resp);
        },
        (error: any) => {
          console.error('Error al registrar el proyecto:', error);
        }
      );
    });
  }

}
