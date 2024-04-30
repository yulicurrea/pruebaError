import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estudiantes, ParticipanteExterno } from '../../../modelo/proyectos';
import { ParticipantesExternosService } from '../../../services/participantesExternos';
import { InvestigadorService } from '../../../services/registroInvestigador';
import { UsuarioSesion } from '../../../modelo/usuario';
import { Observable, map, startWith } from 'rxjs';
import { AutenticacionService } from '../../../services/autenticacion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EstudiantesService } from '../../../services/estudiantes';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dialogo-detalle',
  standalone: true,
  templateUrl: './dialogo-detalle.component.html',
  styleUrls: ['./dialogo-detalle.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
})
export class DialogoDetalleComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  estadosProyectoData!: any;
  isEdit!: boolean;
  hide = true;
  estadoProcesoData!: string;
  firstFormGroup: any;
  secondFormGroup: any;
  activeInvestigators: { correo: string; }[] = [];
  usuariosAdmin: any[] = [];
  usuarioSesion!: UsuarioSesion;
  participanteExternoData: ParticipanteExterno[] = [];
  usuariosData: UsuarioSesion[] = [];
  usuariosCoinvestigaData: UsuarioSesion[] = [];
  filteredInvestigators!: Observable<{ correo: string; }[]>;
  investigatorCtrl = new FormControl('');

  estadosProyectos: any[] = [];
  selectedInvestigators: string[] = [];
  estudiantesData: Estudiantes[] = [];
  selectedFileProyecto: File = null!;
  estadoProyectoData: any[] = [];
  estadoProductoData: any[] = [];
  cuartilEsperadoData: any[] = [];

  estadosProceso: string[] = [
    'Aprobado',
    'Rechazado',
    'Corregir',
    'Espera'
  ];
  origenData: string[] = [
    'nacional',
    'internacional'
  ];
  modalidadData: string[] = [
    'general',
    'clinical',
    'creación',
  ];
  nivelRiesgoEticoData: any[] = [
    'Alto',
    'Medio',
    'Bajo',
    'Sin riesgo',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      type: string,
      data: any,
      estadosProyectoData: any,
      isEdit: boolean,
    },
    private readonly dialogRef: MatDialogRef<DialogoDetalleComponent>,
    private proyectoyproductoService: ProyectoyproductoService,
    private participantesExternosService: ParticipantesExternosService,
    private investigatorService: InvestigadorService,
    private formBuilder: FormBuilder,
    private estudiantesService: EstudiantesService,
    private AutenticacionService:AutenticacionService,
  ) { 
  }  
  async ngOnInit(): Promise<void> {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;
    this.estadosProyectoData = this.dialogData.estadosProyectoData;
    this.isEdit = this.dialogData.isEdit;

    this.obtenerEstudiantes();
    this.obtenerParticipantesExternos();
    this.obtenerUsuarios();
    this.obtenerDatosUsuarioSesion();

    if(this.type == 'Proyecto'){
      this.obtenerEstadosProyecto();
      this.obtenerEstadoProyecto();

      this.firstFormGroup = this.formBuilder.group({
        codigo: [{value: this.data?.codigo, disabled: this.isEdit ? true : false}, [Validators.required]],
        titulo: [this.data?.titulo,[Validators.required]],
        area: [this.data?.area,[Validators.required]],
        investigador: [{value: this.data?.investigador, disabled: this.isEdit ? true : false}, [Validators.required]],
        coinvestigador: [this.data?.coinvestigador, [Validators.required]],
        convocatoria: [this.data?.convocatoria,[Validators.required]],
        estado: [{value: this.data?.estado, disabled: this.isEdit ? true : false},[Validators.required]],
        estadoProceso: [{value: this.data?.estadoProceso, disabled: this.isEdit ? true : false},[Validators.required]],
        estudiantesProyecto: [this.data?.estudiantes,[Validators.required]],
        participantesExternos: [this.data?.participantesExternos,[Validators.required]],
        fecha: [this.data?.fecha,[Validators.required]], 
        grupoInvestigacionPro: [this.data?.grupoInvestigacionPro,[Validators.required]],
        lineaInvestigacion: [this.data?.lineaInvestigacion,[Validators.required]],
        modalidad: [this.data?.modalidad,[Validators.required]],
        nivelRiesgoEtico: [this.data?.nivelRiesgoEtico,[Validators.required]],
        origen: [this.data?.origen,[Validators.required]],

        porcentajeAvance: [this.data?.porcentajeAvance,[Validators.required]],
        porcentajeEjecucionCorte: [this.data?.porcentajeEjecucionCorte,[Validators.required]],
        porcentajeEjecucionFinCorte: [this.data?.porcentajeEjecucionFinCorte,[Validators.required]],
      });

      
      this.firstFormGroup.controls['investigador'].setValue(this.data?.investigador);
      this.firstFormGroup.controls['coinvestigador'].setValue(this.data?.coinvestigador);
      this.firstFormGroup.controls['estado'].setValue(this.data?.estado);
      this.firstFormGroup.controls['estadoProceso'].setValue(this.data?.estadoProceso);
      this.firstFormGroup.controls['estudiantesProyecto'].setValue(this.data?.estudiantes);
      this.firstFormGroup.controls['participantesExternos'].setValue(this.data?.participantesExternos);

    } else {
      this.obtenerCuartilEsperado();
      this.obtenerEstadoProducto();
      this.secondFormGroup = this.formBuilder.group({
        coinvestigador: [this.data?.coinvestigador,[Validators.required]],
        categoriaMinciencias: [this.data?.categoriaMinciencias,[Validators.required]],
        cuartilEsperado: [this.data?.cuartilEsperado,[Validators.required]],
        estadoProceso: [{value: this.data?.estadoProceso, disabled: this.isEdit ? true : false},[Validators.required]],
        estadoProducto: [{value: this.data?.estadoProducto, disabled: this.isEdit ? true : false},[Validators.required]],
        estudiantes: [this.data?.estudiantes,[Validators.required]],
        fechaProducto: [this.data?.fecha,[Validators.required]],
        id: [{value: this.data?.id, disabled: this.isEdit ? true : false},[Validators.required]],
        investigadorProducto: [{value: this.data?.investigador, disabled: this.isEdit ? true : false},[Validators.required]],
        observaciones: [this.data?.observaciones,[Validators.required]],
        origenProyecto: [this.data?.origen,[Validators.required]],
        participantesExternosProducto: [this.data?.participantesExternos,[Validators.required]],
        porcentajeComSemestral: [this.data?.porcentajeComSemestral,[Validators.required]],
        porcentajeRealMensual: [this.data?.porcentajeRealMensual,[Validators.required]],
        porcentanjeAvanFinSemestre: [this.data?.porcentanjeAvanFinSemestre,[Validators.required]],
        publicacion: [this.data?.publicacion,[Validators.required]],
        tituloProducto: [this.data?.tituloProducto,[Validators.required]],
      });
      this.secondFormGroup.controls['coinvestigador'].setValue(this.data?.coinvestigador);
      this.secondFormGroup.controls['cuartilEsperado'].setValue(this.data?.cuartilEsperado);
      this.secondFormGroup.controls['estadoProceso'].setValue(this.data?.estadoProceso);
      this.secondFormGroup.controls['estudiantes'].setValue(this.data?.estudiantes);
      this.secondFormGroup.controls['investigadorProducto'].setValue(this.data?.investigador);
      this.secondFormGroup.controls['participantesExternosProducto'].setValue(this.data?.participantesExternos);
    }

  }

  get codigo() {
    return this.firstFormGroup.get('codigo');
  }
  get titulo() {
    return this.firstFormGroup.get('titulo');
  }
  get area() {
    return this.firstFormGroup.get('area');
  }
  get investigador() {
    return this.firstFormGroup.get('investigador');
  }
  get coinvestigador() {
    return this.firstFormGroup.get('coinvestigador');
  }
  get convocatoria() {
    return this.firstFormGroup.get('convocatoria');
  }
  get estado() {
    return this.firstFormGroup.get('estado');
  }
  get estadoProceso() {
    return this.firstFormGroup.get('estadoProceso');
  }
  get estudiantesProyecto() {
    return this.firstFormGroup.get('estudiantesProyecto');
  }
  get participantesExternos() {
    return this.firstFormGroup.get('participantesExternos');
  }
  get fecha() {
    return this.firstFormGroup.get('fecha');
  }
  get lineaInvestigacion() {
    return this.firstFormGroup.get('lineaInvestigacion');
  }
  get modalidad() {
    return this.firstFormGroup.get('modalidad');
  }
  get nivelRiesgoEtico() {
    return this.firstFormGroup.get('nivelRiesgoEtico');
  }
  get origen() {
    return this.firstFormGroup.get('origen');
  }
  get porcentajeAvance() {
    return this.firstFormGroup.get('porcentajeAvance');
  }
  get porcentajeEjecucionCorte() {
    return this.firstFormGroup.get('porcentajeEjecucionCorte');
  }
  get porcentajeEjecucionFinCorte() {
    return this.firstFormGroup.get('porcentajeEjecucionFinCorte');
  }

  // second form
  get cuartilEsperado() {
    return this.secondFormGroup.get('cuartilEsperado');
  }
  get estadoProducto() {
    return this.secondFormGroup.get('estadoProducto');
  }
  get estudiantes() {
    return this.secondFormGroup.get('estudiantes');
  }
  get fechaProducto() {
    return this.secondFormGroup.get('fechaProducto');
  }
  get id() {
    return this.secondFormGroup.get('id');
  }
  get investigadorProducto() {
    return this.secondFormGroup.get('investigadorProducto');
  }
  get observaciones() {
    return this.secondFormGroup.get('observaciones');
  }
  get origenProyecto() {
    return this.secondFormGroup.get('origenProyecto');
  }
  get participantesExternosProducto() {
    return this.secondFormGroup.get('participantesExternosProducto');
  }
  get porcentajeComSemestral() {
    return this.secondFormGroup.get('porcentajeComSemestral');
  }
  get porcentajeRealMensual() {
    return this.secondFormGroup.get('porcentajeRealMensual');
  }
  get porcentanjeAvanFinSemestre() {
    return this.secondFormGroup.get('porcentanjeAvanFinSemestre');
  }
  get publicacion() {
    return this.secondFormGroup.get('publicacion');
  }
  get tituloProducto() {
    return this.secondFormGroup.get('tituloProducto');
  }


  async obtenerEstadosProyecto() {
    this.proyectoyproductoService.obtenerEstadosProyecto().subscribe(
      (proyecto) => {
        this.estadosProyectos = proyecto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  obtenerUsuarios(){
    this.activeInvestigators = []; 
    this.selectedInvestigators = [];
    this.investigatorService.getUsuarios().subscribe((data) => {   
      const usersAdmin = data.filter(u => u.rolinvestigador === 'Administrador');
      usersAdmin.forEach(element => {
        this.usuariosAdmin.push(element.numerodocumento);
      });
      this.usuariosData = data;
      this.usuariosCoinvestigaData = data.filter(x => x.correo !== this.usuarioSesion.correo);
    });
  }

  obtenerDatosUsuarioSesion(){
    this.usuarioSesion = this.AutenticacionService.obtenerDatosUsuario();
  }

  obtenerEstadoProyecto(){
    this.proyectoyproductoService.getEstadoProyecto().subscribe(
      (data) => {
        this.estadoProyectoData = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );;
  }

  obtenerEstudiantes(){
    this.estudiantesService.getEstudiantes().subscribe((data) => {    
      this.estudiantesData = data;
    });
  }

  obtenerParticipantesExternos(){
    this.participantesExternosService.getParticipantesExternos().subscribe((data) => {    
      this.participanteExternoData = data;
    });
  }

  obtenerCuartilEsperado(){
    this.proyectoyproductoService.getCuartilEsperado().subscribe((data) => {    
      this.cuartilEsperadoData = data;
    });
  }


  guardarTramite() {
    if (this.firstFormGroup !== undefined && this.firstFormGroup.valid) {
      const tramiteGeneral = this.firstFormGroup.value;
      tramiteGeneral.codigo = this.data?.codigo;
      tramiteGeneral.estadoProceso = this.data?.estadoProceso;
      tramiteGeneral.estado = this.data?.estado;
      tramiteGeneral.observacion = this.data?.observacion;
      tramiteGeneral.type = 'general';
      this.proyectoyproductoService.actualizarProyecto(tramiteGeneral).subscribe(
        (resp) => {
          console.log('Se ha actualizado el proyecto:', resp);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al notificar:', error);
        }
      );
    }
    if (this.secondFormGroup !== undefined && this.secondFormGroup.valid) {
      const tramiteGeneral = this.secondFormGroup.value;
      tramiteGeneral.id = this.data?.id;
      tramiteGeneral.estadoProceso = this.data?.estadoProceso;
      tramiteGeneral.estado = this.data?.estadoProducto;
      tramiteGeneral.observacion = this.data?.observacion;
      tramiteGeneral.type = 'general';
      this.proyectoyproductoService.actualizarProducto(tramiteGeneral).subscribe(
        (resp) => {
          console.log('Se ha actualizado el producto:', resp);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al notificar:', error);
        }
      );
    }
  }

  obtenerEstadoProducto(){
    this.proyectoyproductoService.obtenerEstadosProducto().subscribe(
      (data) => {
        this.estadoProductoData = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );;
  }
}
