import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Asegúrate de importar MatPaginator desde '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { SelectionModel } from '@angular/cdk/collections';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';

import { AsyncPipe } from '@angular/common';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete'; 
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Investigador } from '../../modelo/investigador';
import { Evento, Producto } from '../../modelo/productos';
import { Coinvestigador, Estudiantes, ParticipanteExterno, Proyecto } from '../../modelo/proyectos';
import { Product, Person, Proyectos } from '../../modelo/person';
import { ProyectoyproductoService } from '../../services/proyectoyproducto';
import { EstudiantesService } from '../../services/estudiantes';
import { InvestigadorService } from '../../services/registroInvestigador';
import { SearchService } from '../../services/search.service';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { AutenticacionService } from '../../services/autenticacion';
import { UsuarioSesion } from '../../modelo/usuario';
import { DialogoCreacionEstudiantesComponent } from '../../dialogo-creacion-estudiantes/dialogo-creacion-estudiantes.component';
import { ParticipantesExternosService } from '../../services/participantesExternos';
import { DialogoCreacionParticipantesComponent } from '../../dialogo-creacion-participantes/dialogo-creacion-participantes.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogoConfiguracionEntregableComponent } from './dialogo-configuracion-entregable/dialogo-configuracion-entregable.component';
import { DialogoEditarPlanTrabajoComponent } from './dialogo-editar-plan-trabajo/dialogo-editar-plan-trabajo.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DialogoAvanceEntregableComponent } from './dialogo-avance-entregable/dialogo-avance-entregable.component';
import { DialogoDetalleComponent } from '../../administrador/control/dialogo-detalle/dialogo-detalle.component';

@Component({ selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.css'],
    standalone: true,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ], imports: [MatTabsModule,
        MatSelectModule,
        MatExpansionModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatStepperModule,
        MatButtonToggleModule,
        MatNativeDateModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        MatFormFieldModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatCheckboxModule,
        MatSliderModule,
        MatRadioModule,
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        DialogoCreacionEstudiantesComponent,
        MatTooltipModule],  })//providers: [provideHttpClient(withInterceptorsFromDi())]

export class ProyectosComponent implements OnInit {
  //mostrar los coinvestigadores que hay
  separatorKeysCodes: number[] = [13, 188];
  investigatorCtrl = new FormControl('');
  filteredInvestigators!: Observable<{ correo: string; }[]>;
  activeInvestigators: { correo: string; }[] = [];
  selectedInvestigators: string[] = [];
  proyecto: Proyecto = {};
  usuarioSesion!: UsuarioSesion; 
  dataSources = new MatTableDataSource<any>(); 
  dataSourceses = new MatTableDataSource<any>(); 
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  origenData: any[] = [
    {value: 'nacional', viewValue: 'nacional'},
    {value: 'internacional', viewValue: 'internacional'},
  ];
  modalidadData: any[] = [
    {value: 'general', viewValue: 'general'},
    {value: 'clinical', viewValue: 'clinical'},
    {value: 'creación', viewValue: 'creación'},
  ];
  nivelRiesgoEticoData: any[] = [
    {value: 'Alto', viewValue: 'Alto'},
    {value: 'Medio', viewValue: 'Medio'},
    {value: 'Bajo', viewValue: 'Bajo'},
    {value: 'Sin riesgo', viewValue: 'Sin riesgo'},
  ];
  estadoProcesoData: any[] = [
    {value: 'Aprobado', viewValue: 'Aprobado'},
    {value: 'Rechazado', viewValue: 'Rechazado'},
    {value: 'Corregir', viewValue: 'Corregir'},
    {value: 'Espera', viewValue: 'Espera'},
  ];
  lineaInvestigacionData: any[] = [
    {value:'Ingeniería de software y sociedad', viewValue:'Ingeniería de software y sociedad'},
    {value:'Ingeniería para la salud y el desarrollo biológico', viewValue: 'Ingeniería para la salud y el desarrollo biológico'},
    {value:'Ingeniería y educación', viewValue:'Ingeniería y educación'},
    {value:'Ingeniería para la sostenibilidad de sistemas naturales', viewValue:'Ingeniería para la sostenibilidad de sistemas naturales'}
  ];
  unidadAcademicaData: any [] =[
    {value:'Facultad de Ingeniería', viewValue: 'Facultad de Ingeniería'},
    {value:'Facultad de Ciencias',  viewValue: 'Facultad de Ciencias'},
    {value:'Facultad de Educación',  viewValue: 'Facultad de Educación'}
  ];
  // índice de las pestaña Proyectos y Nuevo
  demo1TabIndex!: number;
  expandedElement: any | null;
  proyectosData: any[] = [];
  productosData: any[] = [];
  allProyectosData: any[] = [];
  allProductosData: any[] = [];
  estadosProyectos: any[] = [];
  estadosProductos: any[] = [];
  codigosProyectosExistentes: string[] = []; 
  codigosProyectosFiltrados: string[] = [];
  searchTerm: string = '';

  @ViewChild('investigatorInput')
  investigatorInput!: ElementRef<HTMLInputElement>;

  selectedOption: string;
  codigoExistente: boolean = false;
  mensajeError: string = '';
  idExistente: boolean = false;
  mensajeErrorId: string = '';
  form: FormGroup;
  rolControl: FormControl;
  horasEstrictosControl: FormControl;
  idConfiguracion: string | null = null; 
  

  constructor(
    private ProyectoyproductoService: ProyectoyproductoService,
    private formBuilder: FormBuilder,
    private investigatorService: InvestigadorService,
    private SearchService:SearchService,
    private AutenticacionService:AutenticacionService,
    private estudiantesService: EstudiantesService,
    private participantesExternosService: ParticipantesExternosService,
    public dialog: MatDialog
    
  ) {
    this.firstFormGroup = this.formBuilder.group({
      codigo: [''],
      titulo: [''],
      investigador: [''],
      unidadAcademica: [''],
      coinvestigadores: ['', this.selectedInvestigators],
      estudiantesProyecto: ['', this.estudiantesData],
      participantesExternosProyecto: ['', this.participanteExternoData],
      area: [''],
      porcentajeEjecucionCorte: [0],
      entidadPostulo: this.formBuilder.group({
        id: [''],
        nombreInstitucion: ['',[ Validators.pattern(/^[a-zA-Z\s]*$/)]],
        nombreGrupo: ['',[ Validators.pattern(/^[a-zA-Z\s]*$/)]],
      }),
      financiacion: this.formBuilder.group({
        id: [''],
        valorPropuestoFin: ['', [ Validators.pattern(/^\d+$/)]],
        valorEjecutadoFin: ['', [ Validators.pattern(/^\d+$/)]],

      }),
      grupoInvestigacionPro: [''],
      porcentajeEjecucionFinCorte: [0],
      porcentajeAvance: [0],
      soporte: ['',this.selectedFileProyecto],
      transacciones: this.formBuilder.group({
        id: [''],
        fecha: [''],
        acta: ['',this.selectedFiletransaccion],
        descripcion: [''],
      }),
      origen: [''],
      convocatoria: [''],
      ubicacionProyecto: this.formBuilder.group({
        id: [''],
        instalacion: [''],
        municipio: [''],
        departamento: [''],
        pais: [''],
      }),
      estadoProyecto: new FormControl(''),
      modalidadProyecto: [''],
      nivelRiesgoEtico: [''],
      lineaInvestigacion: [''],
      entregableAdministrativo: this.formBuilder.group({
        id: [''],
        titulo: [''],
        nombre: [''],
        calidad: [''],
        entregable: [''],
        pendiente: [''],
        clasificacion: [''],
      }),
      producto: this.formBuilder.group({
        id: [''],
        tituloProducto: [''],
        investigador: [''],
        listaProducto: this.formBuilder.group({
          id:[''],
          articulo: this.formBuilder.group({
            id:[''],
            fuente:[''],
          }),
          capitulo: this.formBuilder.group({
            id:[''],
            nombrepublicacion:[''],
            isbn :[''],
            fecha:[''],
            editorial:[''],
          }),
          software: this.formBuilder.group({
            id:[''],
            tiporegistro:[''],
            numero:[''],
            fechaSoftware:[''],
            pais:[''],
          }),
          libro: this.formBuilder.group({
            id:[''],
            isbn:[''],
            fechaLibro:[''],
            editorial:[''],
            luegarpublicacion:[''],
          }),
          prototipoIndustrial: this.formBuilder.group({
            id:[''],
            fecha:[''],
            pais:[''],
            insitutofinanciador:[''],
          }),
          evento: this.formBuilder.group({
            id:[''],
            fechainicio:[''],
            fechafin:[''],
            numparticinerno:[''],
            numparticexterno:[''],
            tipoevento:[''],
          }),
          reconocimiento: this.formBuilder.group({
            id:[''],
            fecha:[''],
            nombentidadotorgada:[''],
          }),
          consultoria: this.formBuilder.group({
            id:[''],
            año:[''],
            contrato:this.formBuilder.group({
              id:[''],
              nombre:[''],
              numero:[''],
            }),
            nombreEntidad:[''],
          }),
          contenido: this.formBuilder.group({
            id:[''],
            paginaWeb:[''],
            nombreEntidad:[''],
          }),
          pregFinalizadoyCurso: this.formBuilder.group({
            id:[''],
            fechaInicio:[''],
            reconocimientos:[''],
            numeroPaginas:[''],
          }),
          apropiacion: this.formBuilder.group({
            id:[''],
            fechainicio:[''],
            fechaFin:[''],
            licencia:this.formBuilder.group({
              id:[''],
              nombre:[''],
            }),
            formato:[''],
            medio:[''],
            nombreEntidad:[''],
          }),
          maestria: this.formBuilder.group({
            id:[''],
            fechaInicio:[''],
            institucion:[''],
          }),
          proyectoCursoProducto: [''],
          proyectoFormuladoProducto: [''],
          proyectoRSUProducto: [''],
        }),
        publicacion: [''],
        estudiantes: [''],
        participantesExternos: [''],
        estadoProdIniSemestre: [''],
        porcentanjeAvanFinSemestre: [0],
        observaciones: [''],
        estadoProducto: [''],
        porcentajeComSemestral: [0],
        porcentajeRealMensual: [0],
        fechaProducto:[new Date()],
        origen: [''],
        Soporte: ['',this.FileProducto],
        estudiantesProducto: [''],
        participantesExternosProducto: [''],
        coinvestigadoresProducto: [''],
      })
    });
    this.productoFormGroup = this.formBuilder.group({
      codigo:[''],
      id: [''],
      tituloProducto: [''],
      investigador: [''],
      listaProducto: this.formBuilder.group({
        id:[''],
        articulo: this.formBuilder.group({
          id:[''],
          fuente:[''],
        }),
        capitulo: this.formBuilder.group({
          id:[''],
          nombrepublicacion:[''],
          isbn :[''],
          fecha:[''],
          editorial:[''],
        }),
        software: this.formBuilder.group({
          id:[''],
          tiporegistro:[''],
          numero:[''],
          fechaSoftware:[''],
          pais:[''],
        }),
        libro: this.formBuilder.group({
          id:[''],
          isbn:[''],
          fechaLibro:[''],
          editorial:[''],
          luegarpublicacion:[''],
        }),
        prototipoIndustrial: this.formBuilder.group({
          id:[''],
          fecha:[''],
          pais:[''],
          insitutofinanciador:[''],
        }),
        evento: this.formBuilder.group({
          id:[''],
          fechainicio:[''],
          fechafin:[''],
          numparticinerno:[''],
          numparticexterno:[''],
          tipoevento:[''],
        }),
        reconocimiento: this.formBuilder.group({
          id:[''],
          fecha:[''],
          nombentidadotorgada:[''],
        }),
        consultoria: this.formBuilder.group({
          id:[''],
          año:[''],
          contrato:this.formBuilder.group({
            id:[''],
            nombre:[''],
            numero:[''],
          }),
          nombreEntidad:[''],
        }),
        contenido: this.formBuilder.group({
          id:[''],
          paginaWeb:[''],
          nombreEntidad:[''],
        }),
        pregFinalizadoyCurso: this.formBuilder.group({
          id:[''],
          fechaInicio:[''],
          reconocimientos:[''],
          numeroPaginas:[''],
        }),
        apropiacion: this.formBuilder.group({
          id:[''],
          fechainicio:[''],
          fechaFin:[''],
          licencia:this.formBuilder.group({
            id:[''],
            nombre:[''],
          }),
          formato:[''],
          medio:[''],
          nombreEntidad:[''],
        }),
        maestria: this.formBuilder.group({
          id:[''],
          fechaInicio:[''],
          institucion:[''],
        }),
        proyectoCursoProducto: [''],
        proyectoFormuladoProducto: [''],
        proyectoRSUProducto: [''],
      }),
      publicacion: [''],
      estudiantes: [''],
      participantesExternos: [''],
      estadoProdIniSemestre: [''],
      porcentanjeAvanFinSemestre: [0],
      observaciones: [''],
      estadoProducto: [''],
      porcentajeComSemestral: [0],
      porcentajeRealMensual: [0],
      origen: [''],
      Soporte: ['',this.FileProducto],
      estudiantesProducto: [''],
      participantesExternosProducto: [''],
      coinvestigadoresProducto: [''],
    });
    this.selectedOption  = '';
    this.form = this.formBuilder.group({
      activarCampos: [false],
      rol: [{ value: '', disabled: true }],
      horasEstrictos: [{ value: '', disabled: true }, [Validators.required]]
    });
    this.rolControl = this.form.get('rol') as FormControl;
    this.horasEstrictosControl = this.form.get('horasEstrictos') as FormControl;
  }

  //mostrar todos los proyectos existenetes
  obtenerCodigosProyectos() {
    this.ProyectoyproductoService.getProyectos().subscribe(
      proyectos => {
        this.codigosProyectosExistentes = proyectos.map(proyecto => proyecto.codigo);
        this.codigosProyectosFiltrados = [...this.codigosProyectosExistentes]; // Inicialmente mostrar todos los códigos
        console.log('Códigos de proyectos existentes:', this.codigosProyectosExistentes);
      },
      error => {
        console.error('Error al obtener los proyectos:', error);
      }
    );
  }

  //verificar si existe el codigo de proyecto y producto
  verificarCodigo() {
    const codigo = this.firstFormGroup.get('codigo')?.value;
    if (codigo) {
      this.ProyectoyproductoService.getProyectos().subscribe(proyectos => {
        const existe = proyectos.some(proyecto => proyecto.codigo === codigo);
        this.codigoExistente = existe;
        this.mensajeError = existe ? `El código ${codigo} ya existe.` : '';
      });
    }
  }

  verificarId() {
    const id = this.firstFormGroup.get('producto.id')?.value;
    if (id) {
      this.ProyectoyproductoService.getProductos().subscribe(productos => {
        const existe = productos.some(producto => producto.id === id);
        this.idExistente = existe;
        this.mensajeErrorId = existe ? `El ID ${id} ya existe.` : '';
      });
    }
  }

  //verificar si existe el producto
  verificarIds() {
    const id = this.productoFormGroup.get('id')?.value;
    if (id) {
      this.ProyectoyproductoService.getProductos().subscribe(productos => {
        const existe = productos.some(producto => producto.id === id);
        this.idExistente = existe;
        this.mensajeErrorId = existe ? `El ID ${id} ya existe.` : '';
      });
    }
  }
  //seleccionar en proyecto
  onSelectionChange2(event: any) {
    this.selectedOption = event.value;
  }

  ngOnInit(): void {
    this.obtenerCodigosProyectos();
    this.obtenerUsuarios();
    this.configurarDatasource();
    this.configurarDatasourceses();
    this.obtenerDatosUsuarioSesion();
    this.obtenerEstudiantes();
    this.obtenerParticipantesExternos();
    this.obtenerEventos();
    this.obtenerEntregableProyecto();
    this.obtenerEntregableProducto();
    this.obtenerEstadosProyecto();
    this.obtenerEstadosProducto();
    this.obtenerPlanTrabajo();
    this.loadProjectsAndProducts();
    
  }

  obtenerEntregableProyecto(){
    this.ProyectoyproductoService.obtenerEntregablesProyecto().subscribe((data) => {    
      const dataProject = data.reverse();
      this.proyectosData = dataProject.map(x => {
        const date1 = moment(x.fecha, 'YYYY-MM-DD'); 
        const date2 = moment(); 
        const diferenciaDias = date1.diff(date2, 'days');
        const estadoEntregable = x.estado !== undefined ? x.estado : (diferenciaDias >= 0);

      return {
          descripcion: x.descripcion,
          estado: estadoEntregable,
          estadoProceso: x.estadoProceso,
          observacion: x.observacion,
          fecha: x.fecha,
          id: x.id,
          proyecto_id: x.proyecto_id,
          updated_at: x.updated_at,
          diferenciaDias: diferenciaDias
        }
      })
    });
  }

  obtenerEntregableProducto(){
    this.ProyectoyproductoService.obtenerEntregablesProducto().subscribe((data) => {    
      console.log('Datos obtenidos del proyecto:', data);  
      const dataProduct = data.reverse();
      this.productosData = dataProduct.map(x => {
        const date1 = moment(x.fecha, 'YYYY-MM-DD'); 
        const date2 = moment();
        const diferenciaDias = date1.diff(date2, 'days');
        const estadoEntregable = x.estado !== undefined ? x.estado : (diferenciaDias >= 0);

        return {
          created_at: x.created_at,
          descripcion: x.descripcion,
          estado: estadoEntregable,
          estadoProceso: x.estadoProceso,
          observacion: x.observacion,
          fecha: x.fecha,
          id: x.id,
          producto_id: x.producto_id,
          updated_at: x.updated_at,
          diferenciaDias: diferenciaDias
        }
      })
    });
  }

  openDialogoConfiguracionEntregable(data: any, tipo:string): void {
    const dialogRef = this.dialog.open(DialogoConfiguracionEntregableComponent, {
      data: {
        title: 'Entregables '+data?.tituloProducto,
        buttonTitle: 'Crear',
        type:tipo,
        data:data,
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado una nueva configuración',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } 
    });
  }

  openDialogoConfiguracionAvance(origin: any,data: any, tipo:string):void {
    const dialogRef = this.dialog.open(DialogoAvanceEntregableComponent, {
      data: {
        title: `Avance ${data.descripcion}`,
        buttonTitle: 'Crear',
        type:tipo,
        data:data,
        origin:origin,
        admin: false
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado el Avance',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        
      } 
    });
  }

  estudiantesData: Estudiantes[] = []; 
  participanteExternoData: ParticipanteExterno[] = [];

  obtenerDatosUsuarioSesion(){
    this.usuarioSesion = this.AutenticacionService.obtenerDatosUsuario();
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

  eventosData: Evento[]= [];

  obtenerEventos(){
    const eventos = this.ProyectoyproductoService.getEventos().subscribe((data) => {    
      this.eventosData = data;
    });
  }

  usuariosData: UsuarioSesion[] = [];
  usuariosAdmin: any[] = [];
  obtenerUsuarios(){
    this.activeInvestigators = []; // Inicializa activeInvestigators como un array vacío
    this.selectedInvestigators = []; // Asegúrate de que selectedInvestigators esté vacío al principio
    this.investigatorService.getUsuarios().subscribe((data) => {   
      const usersAdmin = data.filter(u => u.rolinvestigador === 'Administrador');
      usersAdmin.forEach(element => {
        this.usuariosAdmin.push(element.numerodocumento);
      });
      this.usuariosData = data.filter(x => x.correo !== this.usuarioSesion.correo);
      const activeInvestigators = data.filter(x => x.correo !== this.usuarioSesion.correo).map((investigador) => ({
        correo: investigador.correo,
      }));

      this.filteredInvestigators = this.investigatorCtrl.valueChanges.pipe(
        startWith(''),
        map((value: string | null) =>
          value ? this._filter(value) : activeInvestigators.slice()
        )
      );
    });
  }

  configurarDatasource(){ 
    this.dataSource.paginator = this.paginator;
    this.SearchService.getSearchQuery().subscribe(query => {
      this.dataSource.filter = query.trim().toLowerCase();
    });
  }
  configurarDatasourceses() { 
    this.dataSourceses.paginator = this.paginator; // Verifica si es correcto usar dataSourceses aquí
    this.SearchService.getSearchQuery().subscribe(query => {
      this.dataSourceses.filter = query.trim().toLowerCase(); // Ajusta según corresponda
    });
  }
 
  openDialogEstudiante(): void {
    const dialogRef = this.dialog.open(DialogoCreacionEstudiantesComponent, {
      data: {
        title: 'Creación Estudiante',
        buttonTitle: 'CREAR',
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado un nuevo estudiante',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.obtenerEstudiantes();
      } 
    });
  }

  openDialogParticipante(): void {
    const dialogRef = this.dialog.open(DialogoCreacionParticipantesComponent, {
      data: {
        title: 'Creación Participante',
        buttonTitle: 'CREAR',
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({ 
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado un nuevo participnate',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.obtenerParticipantesExternos();
      } 
    });
  }

  addCoinvestigador(investigador: {
    correo: string;
  }) {
    const newCoinvestigador: Coinvestigador = {
      correo: investigador.correo,
    };
    if (!this.proyecto.coinvestigadores) {
      this.proyecto.coinvestigadores = [newCoinvestigador];
    } else {
      this.proyecto.coinvestigadores.push(newCoinvestigador);
    }
  }

  removeCoinvestigador(investigador: { correo: string }) {
    if (this.proyecto.coinvestigadores) {
      this.proyecto.coinvestigadores = this.proyecto.coinvestigadores.filter(
        (c) =>
          c.coinvestigador !==
          `${investigador.correo}`
      );
    }
  }

  private _filter(value: string): { correo: string }[] {
    const filterValue = value.toLowerCase();

    if (!filterValue) {
      return this.activeInvestigators.slice(); // Devuelve una copia de todos los investigadores activos si no hay entrada de usuario
    }

    // Filtrar investigadores activos que no estén en la lista de investigadores seleccionados
    const filteredActiveInvestigators = this.activeInvestigators.filter(
      (investigador) =>
        `${investigador.correo.toLowerCase()}`.includes(
          filterValue
        )
    );

    // Filtrar investigadores seleccionables que no estén ya seleccionados
    return filteredActiveInvestigators.filter(
      (investigador) =>
        !this.selectedInvestigators.includes(
          `${investigador.correo}`
        )
    );
  }

  trackByFn(
    index: number,
    item: { correo: string }
  ): number {
    return index;
  }

  remove(investigador: { correo: string }): void {
    const index = this.activeInvestigators.indexOf(investigador);

    if (index >= 0) {
      this.activeInvestigators.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const [correo] = value;
      this.activeInvestigators.push({ correo });
    }
    event.chipInput!.clear();
    this.investigatorCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const correo = event.option.value.correo;
    // Verificar si el investigador ya está en activeInvestigators
    const investigadorExistente = this.activeInvestigators.find(
      (investigador) =>
        investigador.correo === correo
    );

    if (!investigadorExistente) {
      // Agregar el investigador seleccionado solo si no está en la lista
      this.activeInvestigators.push({ correo });
      this.selectedInvestigators.push(`${correo}`);
    }

    this.investigatorInput.nativeElement.value = '';
    this.investigatorCtrl.setValue(null);
  }

  displayInvestigator(investigator: Investigador): string {
    if (
      investigator &&
      investigator.correo
    ) {
      return `${investigator.correo}`;
    } else {
      return '';
    }
  }

  //subir archivo proyecto
  selectedFileProyecto: File = null!;

  onFileSelected(event: any) {
    this.selectedFileProyecto = event.target.files[0] as File;
  }

  //subir archivo producto
  selectedFileProducto: File = null!;

  onFileSelected1(event: any) {
    this.selectedFileProducto = event.target.files[0] as File;
  }

  //subir archivo de transacciones
  selectedFiletransaccion: File = null!;

  onFileSelected3(event: any) {
    this.selectedFiletransaccion = event.target.files[0] as File;
  }

  //mostrar productos en nuevo proyecto
  mostrarInputs: boolean = false;

  onSelectionChange(event: any) {
    this.mostrarInputs = event.value === '1';
  }

  //CREAR PROYECTO
  isEditable = true;

  //BARRAS DE PORCENTAJE
  value: number = 0;
  value2: number = 0;
  value3: number = 0;

  onValueChange(event: any) {
    this.value = Number(event.target.value); // Convertir a número
    const porcentajeEjecucionCorteControl = this.firstFormGroup.get(
      'porcentajeEjecucionCorte'
    );
    if (porcentajeEjecucionCorteControl) {
      // Verificar si porcentajeEjecucionCorteControl no es null ni undefined
      porcentajeEjecucionCorteControl.setValue(this.value.toString()); // Convertir a string y asignar el valor al control del formulario
    }
  }
  onValue2Change(event: any) {
    this.value2 = Number(event.target.value); // Convertir a número
    const porcentajeEjecucionFinCorte = this.firstFormGroup.get(
      'porcentajeEjecucionFinCorte'
    );
    if (porcentajeEjecucionFinCorte) {
      // Verificar si porcentajeEjecucionCorteControl no es null ni undefined
      porcentajeEjecucionFinCorte.setValue(this.value2.toString()); // Convertir a string y asignar el valor al control del formulario
    }
  }
  onValue3Change(event: any) {
    this.value3 = Number(event.target.value); // Convertir a número
    const porcentajeAvance = this.firstFormGroup.get('porcentajeAvance');
    if (porcentajeAvance) {
      // Verificar si porcentajeEjecucionCorteControl no es null ni undefined
      porcentajeAvance.setValue(this.value3.toString()); // Convertir a string y asignar el valor al control del formulario
    }
  }

  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;

  disabled2 = false;
  max2 = 100;
  min2 = 0;
  showTicks2 = false;
  step2 = 1;
  thumbLabel2 = false;

  disabled3 = false;
  max3 = 100;
  min3 = 0;
  showTicks3 = false;
  step3 = 1;
  thumbLabel3 = false;

  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //------------------------------------------Guardar proyecto -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  
  public firstFormGroup: FormGroup;

  get codigo() {
    return this.firstFormGroup.get('codigo');
  }
  get fecha() {
    return this.firstFormGroup.get('fecha');
  }
  get titulo() {
    return this.firstFormGroup.get('titulo');
  }
  get investigador() {
    return this.firstFormGroup.get('investigador');
  }
  get unidadAcademica() {
    return this.firstFormGroup.get('unidadAcademica');
  }
  get producto() {
    return this.firstFormGroup.get('producto');
  }
  get coinvestigadores() {
    return this.firstFormGroup.get('coinvestigadores');
  }
  get area() {
    return this.firstFormGroup.get('area');
  }
  get porcentajeEjecucionCorte() {
    return this.firstFormGroup.get('porcentajeEjecucionCorte');
  }
  get entidadPostulo() {
    return this.firstFormGroup.get('entidadPostulo');
  }
  get financiacion() {
    return this.firstFormGroup.get('financiacion');
  }
  get grupoInvestigacionPro() {
    return this.firstFormGroup.get('grupoInvestigacionPro');
  }
  get porcentajeEjecucionFinCorte() {
    return this.firstFormGroup.get('porcentajeEjecucionFinCorte');
  }
  get porcentajeAvance() {
    return this.firstFormGroup.get('porcentajeAvance');
  }
  get soporte() {
    return this.firstFormGroup.get('soporte');
  }
  get transacciones() {
    return this.firstFormGroup.get('transacciones');
  }
  get origen() {
    return this.firstFormGroup.get('origen');
  }
  get convocatoria() {
    return this.firstFormGroup.get('convocatoria');
  }
  get ubicacionProyecto() {
    return this.firstFormGroup.get('ubicacionProyecto');
  }
  get estadoProyecto() {
    return this.firstFormGroup.get('estadoProyecto');
  }
  get modalidadProyecto() {
    return this.firstFormGroup.get('modalidadProyecto');
  }
  get nivelRiesgoEtico() {
    return this.firstFormGroup.get('nivelRiesgoEtico');
  }
  get lineaInvestigacion() {
    return this.firstFormGroup.get('lineaInvestigacion');
  }
  get entregableAdministrativo() {
    return this.firstFormGroup.get('entregableAdministrativo');
  }
  get estudiantesProyecto() {
    return this.firstFormGroup.get('estudiantesProyecto');
  }
  get participantesExternosProyecto() {
    return this.firstFormGroup.get('participantesExternosProyecto');
  }

  onSaveForm(): void {
    console.log('proyecto:', this.firstFormGroup.value);
  }

  notificar(asunto:string,remitente:any,destinatario:string[],mensaje:string):void {
    destinatario.forEach(admin => {
      const notificacion = {
        asunto: asunto,
        remitente: remitente,
        destinatario: admin,
        mensaje: mensaje
      }
      this.ProyectoyproductoService.notificar(notificacion).subscribe(
        (resp: any) => {
          console.log('Se ha registrado el proyecto exitosamente:', resp);
        },
        (error: any) => {
          console.error('Error al registrar el proyecto:', error);
        }
      );
    });
  }

  guardarProyecto() {
    if (this.firstFormGroup.valid) {
      console.log( "datos tomados:",this.firstFormGroup.value)
      const proyecto: Proyecto = {
        codigo: this.firstFormGroup.get('codigo')?.value,
        titulo: this.firstFormGroup.get('titulo')?.value,
        investigador: this.firstFormGroup.get('investigador')?.value,
        unidadAcademica: this.firstFormGroup.get('unidadAcademica')?.value,
        coinvestigadores: this.firstFormGroup.get('coinvestigadores')?.value,
        area: this.firstFormGroup.get('area')?.value,
        porcentajeEjecucionCorte: this.firstFormGroup.get(
          'porcentajeEjecucionCorte'
        )?.value,
        entidadPostulo: this.firstFormGroup.get('entidadPostulo')?.value,
        financiacion: this.firstFormGroup.get('financiacion')?.value,
        grupoInvestigacionPro: this.firstFormGroup.get('grupoInvestigacionPro')
          ?.value,
        porcentajeEjecucionFinCorte: this.firstFormGroup.get(
          'porcentajeEjecucionFinCorte'
        )?.value,
        porcentajeAvance: this.firstFormGroup.get('porcentajeAvance')?.value,
        soporte: this.selectedFileProyecto,
        soporteProducto: this.selectedFileProduct,
        transacciones: {
          fecha: this.firstFormGroup.get('transacciones.fecha')?.value,
          descripcion: this.firstFormGroup.get('transacciones.descripcion')?.value,
          acta: this.selectedFiletransaccion
        },
        origen: this.firstFormGroup.get('origen')?.value,
        convocatoria: this.firstFormGroup.get('convocatoria')?.value,
        ubicacionProyecto: this.firstFormGroup.get('ubicacionProyecto')?.value,
        estadoProyecto: this.firstFormGroup.get('estadoProyecto')?.value,
        modalidadProyecto: this.firstFormGroup.get('modalidadProyecto')?.value,
        nivelRiesgoEtico: this.firstFormGroup.get('nivelRiesgoEtico')?.value,
        lineaInvestigacion:this.firstFormGroup.get('lineaInvestigacion')?.value,
        estudiantes: this.firstFormGroup.get('estudiantesProyecto')?.value,
        participantesExternos: this.firstFormGroup.get(
          'participantesExternosProyecto'
        )?.value,
        producto: {
          id: this.firstFormGroup.get('producto.id')?.value,
          tituloProducto: this.firstFormGroup.get('producto.tituloProducto')?.value,
          investigador: this.usuarioSesion.numerodocumento,
          listaProducto: {
            id: this.firstFormGroup.get('producto.listaProducto.id')?.value,
            articulo: {
              id: this.firstFormGroup.get('producto.listaProducto.articulo.id')?.value,
              fuente: this.firstFormGroup.get('producto.listaProducto.articulo.fuente')?.value,
            },
            capitulo: {
              id: this.firstFormGroup.get('producto.listaProducto.capitulo.id')?.value,
              nombrepublicacion: this.firstFormGroup.get('producto.listaProducto.capitulo.nombrepublicacion')?.value,
              isbn: this.firstFormGroup.get('producto.listaProducto.capitulo.isbn')?.value,
              fecha: this.firstFormGroup.get('producto.listaProducto.capitulo.fecha')?.value,
              editorial: this.firstFormGroup.get('producto.listaProducto.capitulo.editorial')?.value,
            },
            software: {
              id: this.firstFormGroup.get('producto.listaProducto.software.id')?.value,
              tiporegistro: this.firstFormGroup.get('producto.listaProducto.software.tiporegistro')?.value,
              numero: this.firstFormGroup.get('producto.listaProducto.software.numero')?.value,
              fecha: this.firstFormGroup.get('producto.listaProducto.software.fechaSoftware')?.value,
              pais: this.firstFormGroup.get('producto.listaProducto.software.pais')?.value,
            },
            libro: {
              id: this.firstFormGroup.get('producto.listaProducto.libro.id')?.value,
              isbn: this.firstFormGroup.get('producto.listaProducto.libro.isbn')?.value,
              fecha: this.firstFormGroup.get('producto.listaProducto.libro.fechaLibro')?.value,
              editorial: this.firstFormGroup.get('producto.listaProducto.libro.editorial')?.value,
              luegarpublicacion: this.firstFormGroup.get('producto.listaProducto.libro.luegarpublicacion')?.value,
            },
            prototipoIndustrial: {
              id: this.firstFormGroup.get('producto.listaProducto.prototipoIndustrial.id')?.value,
              fecha: this.firstFormGroup.get('producto.listaProducto.prototipoIndustrial.fecha')?.value,
              pais: this.firstFormGroup.get('producto.listaProducto.prototipoIndustrial.pais')?.value,
              insitutofinanciador: this.firstFormGroup.get('producto.listaProducto.prototipoIndustrial.insitutofinanciador')?.value,
            },
            evento: {
              id: this.firstFormGroup.get('producto.listaProducto.evento.id')?.value,
              fechainicio: this.firstFormGroup.get('producto.listaProducto.evento.fechainicio')?.value,
              fechafin: this.firstFormGroup.get('producto.listaProducto.evento.fechafin')?.value,
              numparticinerno: this.firstFormGroup.get('producto.listaProducto.evento.numparticinerno')?.value,
              numparticexterno: this.firstFormGroup.get('producto.listaProducto.evento.numparticexterno')?.value,
              tipoevento: this.firstFormGroup.get('producto.listaProducto.evento.tipoevento')?.value,
            },
            reconocimiento: {
              id: this.firstFormGroup.get('producto.listaProducto.reconocimiento.id')?.value,
              fecha: this.firstFormGroup.get('producto.listaProducto.reconocimiento.fecha')?.value,
              nombentidadotorgada: this.firstFormGroup.get('producto.listaProducto.reconocimiento.nombentidadotorgada')?.value,
            },
            consultoria: {
              id: this.firstFormGroup.get('producto.listaProducto.consultoria.id')?.value,
              año: this.firstFormGroup.get('producto.listaProducto.consultoria.año')?.value,
              contrato: {
                id: this.firstFormGroup.get('producto.listaProducto.consultoria.contrato.id')?.value,
                nombre: this.firstFormGroup.get('producto.listaProducto.consultoria.contrato.nombre')?.value,
                numero: this.firstFormGroup.get('producto.listaProducto.consultoria.contrato.numero')?.value,
              },
              nombreEntidad: this.firstFormGroup.get('producto.listaProducto.consultoria.nombreEntidad')?.value,
            },
            contenido: {
              id: this.firstFormGroup.get('producto.listaProducto.contenido.id')?.value,
              paginaWeb: this.firstFormGroup.get('producto.listaProducto.contenido.paginaWeb')?.value,
              nombreEntidad: this.firstFormGroup.get('producto.listaProducto.contenido.nombreEntidad')?.value,
            },
            pregFinalizadoyCurso: {
              id: this.firstFormGroup.get('producto.listaProducto.pregFinalizadoyCurso.id')?.value,
              fechaInicio: this.firstFormGroup.get('producto.listaProducto.pregFinalizadoyCurso.fechaInicio')?.value,
              reconocimientos: this.firstFormGroup.get('producto.listaProducto.pregFinalizadoyCurso.reconocimientos')?.value,
              numeroPaginas: this.firstFormGroup.get('producto.listaProducto.pregFinalizadoyCurso.numeroPaginas')?.value,
            },
            apropiacion: {
              id: this.firstFormGroup.get('producto.listaProducto.apropiacion.id')?.value,
              fechainicio: this.firstFormGroup.get('producto.listaProducto.apropiacion.fechainicio')?.value,
              fechaFin: this.firstFormGroup.get('producto.listaProducto.apropiacion.fechaFin')?.value,
              licencia: {
                id: this.firstFormGroup.get('producto.listaProducto.apropiacion.licencia.id')?.value,
                nombre: this.firstFormGroup.get('producto.listaProducto.apropiacion.licencia.nombre')?.value,
              },
              formato: this.firstFormGroup.get('producto.listaProducto.apropiacion.formato')?.value,
              medio: this.firstFormGroup.get('producto.listaProducto.apropiacion.medio')?.value,
              nombreEntidad: this.firstFormGroup.get('producto.listaProducto.apropiacion.nombreEntidad')?.value,
            },
            maestria: {
              id: this.firstFormGroup.get('producto.listaProducto.maestria.id')?.value,
              fechaInicio: this.firstFormGroup.get('producto.listaProducto.maestria.fechaInicio')?.value,
              institucion: this.firstFormGroup.get('producto.listaProducto.maestria.institucion')?.value,
            },
            proyectoCursoProducto: this.firstFormGroup.get('producto.listaProducto.proyectoCursoProducto')?.value,
            proyectoFormuladoProducto: this.firstFormGroup.get('producto.listaProducto.proyectoFormuladoProducto')?.value,
            proyectoRSUProducto: this.firstFormGroup.get('producto.listaProducto.proyectoRSUProducto')?.value,
            },
            publicacion: this.firstFormGroup.get('producto.publicacion')?.value,
            estudiantes: this.firstFormGroup.get('producto.estudiantes')?.value,
            estadoProdIniSemestre: this.firstFormGroup.get('producto.estadoProdIniSemestre')?.value,
            porcentanjeAvanFinSemestre: this.firstFormGroup.get('producto.porcentanjeAvanFinSemestre')?.value,
            observaciones: this.firstFormGroup.value.producto.observaciones,
            estadoProducto: this.firstFormGroup.value.producto.estadoProducto,
            porcentajeComSemestral: this.firstFormGroup.value.producto.porcentajeComSemestral,
            porcentajeRealMensual: this.firstFormGroup.value.producto.porcentajeRealMensual,
            origen: this.firstFormGroup.value.producto.origen,
            Soporte: this.selectedFileProduct,
            estudiantesProducto:  this.firstFormGroup.value.producto.estudiantesProducto,
            participantesExternosProducto:  this.firstFormGroup.value.producto.participantesExternosProducto,
            coinvestigadoresProducto:  this.firstFormGroup.value.producto.coinvestigadoresProducto,
          }        
      };
      console.log("datos de proyeeeecto",proyecto);
      proyecto.estadoProyecto = "Espera";
      proyecto.investigador = this.usuarioSesion.numerodocumento;

      // Llamar a la función crearProyecto para guardar el proyecto en el servidor
      this.ProyectoyproductoService.crearProyecto(proyecto).subscribe(
        (resp: any) => {
          console.log('Se ha registrado el proyecto exitosamente:', resp);
          Swal.fire({
            title: 'Registro Exitoso !!!',
            text: 'Se ha registrado el proyecto exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.reload(); 
          });
          this.ngAfterViewInit();
          this.ngOnInit();
          this.demo1TabIndex = 0;
          this.firstFormGroup.reset();
          this.notificar(
            `Nuevo Proyecto ${resp.codigo}`,
            resp.investigador,
            this.usuariosAdmin,
            `El proyecto ${resp.codigo} ha sido registrado con el estado ${resp.estadoProceso}`
          );
          if(resp.producto !== null){
            
            this.notificar(
              `Nuevo Producto ${resp.id}`,
              resp.investigador,
              this.usuariosAdmin,
              `El producto ${resp.producto.id} ha sido registrado con el estado ${resp.estadoProceso}`
            );
          }
        },
        (error: any) => {
          console.error('Error al registrar el proyecto:', error);
          Swal.fire({
            title: 'Oops...',
            text: 'Error al registrar el proyecto. Contacta al administrador si el error persiste',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      console.log( this.firstFormGroup.value)
      Swal.fire({
        title: 'Datos incompletos !!!',
        text: 'Por favor, completa el formulario correctamente.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  getEstadoProyecto() {
    this.ProyectoyproductoService.getEstadoProyecto().subscribe(
      (resp: any) => {
        console.log('Estado Proyecto:', resp);
      },
      (error: any) => {
        console.error('Error al obtener Estado Proyecto:', error);
      }
    );
  }

  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //------------------------------------------PRODUCTO -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
 
  public productoFormGroup: FormGroup;

  get id() {
    return this.productoFormGroup.get('id');
  }
  get tituloProducto() {
    return this.productoFormGroup.get('tituloProducto');
  }
  get rolProducto() {
    return this.productoFormGroup.get('rolProducto');
  }
  get investigadorPrd() {
    return this.productoFormGroup.get('investigador');
  }
  get listaProducto() {
    return this.productoFormGroup.get('listaProducto');
  }
  get cuartilEsperado() {
    return this.productoFormGroup.get('cuartilEsperado');
  }
  get categoriaMinciencias() {
    return this.productoFormGroup.get('categoriaMinciencias');
  }
  get tipologiaProducto() {
    return this.productoFormGroup.get('tipologiaProducto');
  }
  get publicacion() {
    return this.productoFormGroup.get('publicacion');
  }
  get estudiantes() {
    return this.productoFormGroup.get('estudiantes');
  }
  get participantesExternos() {
    return this.productoFormGroup.get('participantesExternos');
  }
  get estadoProdIniSemestre() {
    return this.productoFormGroup.get('estadoProdIniSemestre');
  }
  get porcentanjeAvanFinSemestre() {
    return this.productoFormGroup.get('porcentanjeAvanFinSemestre');
  }
  get observaciones() {
    return this.productoFormGroup.get('observaciones');
  }
  get estadoProducto() {
    return this.productoFormGroup.get('estadoProducto');
  }
  get porcentajeComSemestral() {
    return this.productoFormGroup.get('porcentajeComSemestral');
  }
  get porcentajeRealMensual() {
    return this.productoFormGroup.get('porcentajeRealMensual');
  }
  get fechaProducto() {
    return this.productoFormGroup.get('fechaProducto');
  }
  get origenPrd() {
    return this.productoFormGroup.get('origen');
  }
  get Soporte() {
    return this.productoFormGroup.get('Soporte');
  }
  get tipoevento(){
    return this.productoFormGroup.get('tipoevento');
  }
  get fuente(){
    return this.productoFormGroup.get('fuente');
  }
  get estudiantesProducto() {
    return this.productoFormGroup.get('estudiantesProducto');
  }
  get participantesExternosProducto() {
    return this.productoFormGroup.get('participantesExternosProducto');
  }
  get coinvestigadoresProducto() {
    return this.productoFormGroup.get('coinvestigadoresProducto');
  }


//Estado del producto
typeEstado: string[] = ['resaccion', 'sometido', 'publicado'];

changeEstado(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && this.estadoProducto) {
    this.estadoProducto.setValue(target.value, {
      onlySelf: true,
    });
  }
}

changeEventos(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && this.tipoevento) {
    this.tipoevento.setValue(target.value, {
      onlySelf: true,
    });
  }
}

// tipo de fuente  de articulos de lista productos
typeFuente: string[] = ['Electronico', 'Impreso'];

changeFuente(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && this.fuente) {
    this.fuente.setValue(target.value, {
      onlySelf: true,
    });
  }
}

//------------------------- PORCENTAJES -----------------------

value4: number = 0;
value5: number = 0;
value6: number = 0;

onValue4Change(event: any) {
  this.value4 = Number(event.target.value);
  const porcentanjeAvanFinSemestre = this.productoFormGroup.get(
    'porcentanjeAvanFinSemestre'
  );
  if (porcentanjeAvanFinSemestre) {
    porcentanjeAvanFinSemestre.setValue(this.value4.toString());
  }
}
onValue5Change(event: any) {
  this.value5 = Number(event.target.value);
  const porcentajeComSemestral = this.productoFormGroup.get(
    'porcentajeComSemestral'
  );
  if (porcentajeComSemestral) {
    porcentajeComSemestral.setValue(this.value5.toString());
  }
}
onValue6Change(event: any) {
  this.value6 = Number(event.target.value);
  const porcentajeRealMensual = this.productoFormGroup.get('porcentajeRealMensual');
  if (porcentajeRealMensual) {
    porcentajeRealMensual.setValue(this.value6.toString());
  }
}

disabled4 = false;
max4 = 100;
min4 = 0;
showTicks4 = false;
step4 = 1;
thumbLabel4 = false;

disabled5 = false;
max5 = 100;
min5 = 0;
showTicks5 = false;
step5 = 1;
thumbLabel5 = false;

disabled6 = false;
max6 = 100;
min6 = 0;
showTicks6 = false;
step6 = 1;
thumbLabel6 = false;


  selectedFileProduct: File = null!;


  //subir archivo producto
  FileProducto: File = null!;

  onFileSelected2(event: any) {
    this.selectedFileProduct = event.target.files[0] as File;
  } 

  guardarProducto() {
    if (this.productoFormGroup.valid) {
      const producto: Producto = {
        codigo: this.productoFormGroup.value.codigo,
        id: this.productoFormGroup.value.id,
        tituloProducto: this.productoFormGroup.value.tituloProducto,
        investigador: this.usuarioSesion.numerodocumento,
        listaProducto: {
          id: this.productoFormGroup.value.listaProducto.id,
          articulo: {
            id: this.productoFormGroup.value.listaProducto.capitulo.id,
            fuente: this.productoFormGroup.value.listaProducto.articulo.fuente
          },
          capitulo: {
            id: this.productoFormGroup.value.listaProducto.capitulo.id,
            nombrepublicacion: this.productoFormGroup.value.listaProducto.capitulo.nombrepublicacion,
            isbn: this.productoFormGroup.value.listaProducto.capitulo.isbn,
            fecha: this.productoFormGroup.value.listaProducto.capitulo.fecha,
            editorial: this.productoFormGroup.value.listaProducto.capitulo.editorial
          },
          software: {
            id: this.productoFormGroup.value.listaProducto.software.id,
            tiporegistro: this.productoFormGroup.value.listaProducto.software.tiporegistro,
            numero: this.productoFormGroup.value.listaProducto.software.numero,
            fecha: this.productoFormGroup.value.listaProducto.software.fechaSoftware,
            pais: this.productoFormGroup.value.listaProducto.software.pais
          },
          libro: {
            id: this.productoFormGroup.value.listaProducto.libro.id,
            isbn: this.productoFormGroup.value.listaProducto.libro.isbn,
            fecha: this.productoFormGroup.value.listaProducto.libro.fechaLibro,
            editorial: this.productoFormGroup.value.listaProducto.libro.editorial,
            luegarpublicacion: this.productoFormGroup.value.listaProducto.libro.luegarpublicacion
          },
          prototipoIndustrial: {
              id: this.productoFormGroup.value.listaProducto.prototipoIndustrial.id,
              fecha: this.productoFormGroup.value.listaProducto.prototipoIndustrial.fecha,
              pais: this.productoFormGroup.value.listaProducto.prototipoIndustrial.pais,
              insitutofinanciador: this.productoFormGroup.value.listaProducto.prototipoIndustrial.insitutofinanciador
          },
          evento: {
              id: this.productoFormGroup.value.listaProducto.evento.id,
              fechainicio: this.productoFormGroup.value.listaProducto.evento.fechainicio,
              fechafin: this.productoFormGroup.value.listaProducto.evento.fechafin,
              numparticinerno: this.productoFormGroup.value.listaProducto.evento.numparticinerno,
              numparticexterno: this.productoFormGroup.value.listaProducto.evento.numparticexterno,
              tipoevento: this.productoFormGroup.value.listaProducto.evento.tipoevento
          },
          reconocimiento: {
              id: this.productoFormGroup.value.listaProducto.reconocimiento.id,
              fecha: this.productoFormGroup.value.listaProducto.reconocimiento.fecha,
              nombentidadotorgada: this.productoFormGroup.value.listaProducto.reconocimiento.nombentidadotorgada
          },
          consultoria: {
              id: this.productoFormGroup.value.listaProducto.consultoria.id,
              año: this.productoFormGroup.value.listaProducto.consultoria.año,
              contrato: {
                  id: this.productoFormGroup.value.listaProducto.consultoria.contrato.id,
                  nombre: this.productoFormGroup.value.listaProducto.consultoria.contrato.nombre,
                  numero: this.productoFormGroup.value.listaProducto.consultoria.contrato.numero
              },
              nombreEntidad: this.productoFormGroup.value.listaProducto.consultoria.nombreEntidad
          },
          contenido: {
              id: this.productoFormGroup.value.listaProducto.contenido.id,
              paginaWeb: this.productoFormGroup.value.listaProducto.contenido.paginaWeb,
              nombreEntidad: this.productoFormGroup.value.listaProducto.contenido.nombreEntidad
          },
          pregFinalizadoyCurso: {
              id: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.id,
              fechaInicio: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.fechaInicio,
              reconocimientos: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.reconocimientos,
              numeroPaginas: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.numeroPaginas
          },
          apropiacion: {
              id: this.productoFormGroup.value.listaProducto.apropiacion.id,
              fechainicio: this.productoFormGroup.value.listaProducto.apropiacion.fechainicio,
              fechaFin: this.productoFormGroup.value.listaProducto.apropiacion.fechaFin,
              licencia: {
                  id: this.productoFormGroup.value.listaProducto.apropiacion.licencia.id,
                  nombre: this.productoFormGroup.value.listaProducto.apropiacion.licencia.nombre
              },
              formato: this.productoFormGroup.value.listaProducto.apropiacion.formato,
              medio: this.productoFormGroup.value.listaProducto.apropiacion.medio,
              nombreEntidad: this.productoFormGroup.value.listaProducto.apropiacion.nombreEntidad
          },
          maestria: {
              id: this.productoFormGroup.value.listaProducto.maestria.id,
              fechaInicio: this.productoFormGroup.value.listaProducto.maestria.fechaInicio,
              institucion: this.productoFormGroup.value.listaProducto.maestria.institucion
          },
          proyectoCursoProducto: this.productoFormGroup.value.listaProducto.proyectoCursoProducto,
          proyectoFormuladoProducto: this.productoFormGroup.value.listaProducto.proyectoFormuladoProducto,
          proyectoRSUProducto: this.productoFormGroup.value.listaProducto.proyectoRSUProducto
        },
        publicacion: this.productoFormGroup.value.publicacion,
        estudiantes: this.productoFormGroup.value.estudiantes,
        estadoProdIniSemestre: this.productoFormGroup.value.estadoProdIniSemestre,
        porcentanjeAvanFinSemestre: this.productoFormGroup.value.porcentanjeAvanFinSemestre,
        observaciones: this.productoFormGroup.value.observaciones,
        estadoProducto: this.productoFormGroup.value.estadoProducto,
        porcentajeComSemestral: this.productoFormGroup.value.porcentajeComSemestral,
        porcentajeRealMensual: this.productoFormGroup.value.porcentajeRealMensual,
        origen: this.productoFormGroup.value.origen,
        Soporte: this.selectedFileProduct,
        estudiantesProducto:  this.productoFormGroup.value.estudiantesProducto,
        participantesExternosProducto:  this.productoFormGroup.value.participantesExternosProducto,
        coinvestigadoresProducto:  this.productoFormGroup.value.coinvestigadoresProducto,
      };
      this.ProyectoyproductoService.crearProducto(producto).subscribe(
          (resp) => {
              console.log('Se ha registrado el usuario exitosamente:', resp);
              Swal.fire({
                title: 'Registro Exitoso !!!',
                text: 'Se ha registrado el producto exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                window.location.reload(); 
              });
              this.notificar(
                `Nuevo Producto ${resp.id}`,
                resp.investigador,
                this.usuariosAdmin,
                `El producto ${resp.id} ha sido registrado con el estado ${resp.estadoProceso}`
              );
              this.productoFormGroup.reset();
              this.ngAfterViewInit();
              this.ngOnInit();
              this.demo1TabIndex = 0;
          },
          (error) => {
              console.error('Error al registrar el usuario:', error);
              Swal.fire({
                title: 'Oops...',
                text: 'Error al registrar el producto. Contacta al administrador si el error persiste',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
          }
      );
    } else {
        Swal.fire({
          title: 'Datos incompletos !!!',
          text: 'Por favor, completa el formulario correctamente.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
    }
  }

  addEvent(x:any) {
    x.select = !x.select;
  }

  obtenerEstadosProyecto() {
    this.ProyectoyproductoService.obtenerEstadosProyecto().subscribe(
      (proyecto) => {
        this.estadosProyectos = proyecto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerEstadosProducto() {
    this.ProyectoyproductoService.obtenerEstadosProducto().subscribe(
      (producto) => {
        this.estadosProductos = producto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  openDialogoDetalle(data: any, tipo:string, isEdit:boolean): void {
    const dialogRef = this.dialog.open(DialogoDetalleComponent, {
      data: {
        title: isEdit ? 'Editar '+tipo : 'Detalle '+tipo,
        buttonTitle: 'Guardar',
        type: tipo,
        data:tipo==='Proyecto' ? this.allProyectosData.find(x => x.codigo === data.codigo) : this.allProductosData.find(x => x.id === data.id),
        isEdit: isEdit
      },
      disableClose: true,
      panelClass: "dialog-responsive"
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
        this.ngAfterViewInit();
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha editado el registro',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } 
    });
  }

  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //------------------------------------------TABLA -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
 
  displayedColumns: string[] = ['tipo', 'titulo', 'estado', 'etapa', 'acciones', 'expand'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  
  
  expandedDetail = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
    console.log("DATOS TRAIDOS:" ,this.ProyectoyproductoService.getProductosDelUsuario())
    forkJoin([
      this.ProyectoyproductoService.getProductosDelUsuario(),
      this.ProyectoyproductoService.getProyectosDelUsuario()
    ]).subscribe(([productos, proyectos]) => {

      this.allProyectosData = proyectos;
      this.allProductosData = productos;
      // Ajustar los datos de los productos para asegurarse de que tengan todas las propiedades definidas en la interfaz Producto
      const productosAjustados = productos.reverse().map(producto => ({
        ...producto,
        tipo: 'Producto',
        id:producto.id,
        tituloProducto: producto.tituloProducto || '', // Asegurar que todas las propiedades definidas en la interfaz Producto estén presentes
        fecha: producto.fecha || '',
        estadoProducto: producto.estadoProceso || '', 
        etapa: this.estadosProductos.find(p => p.id === producto.estadoProducto).estado,
        tipologiaProducto: producto.tipologiaProducto || '',
        observacion: producto.observacion,
        investigador: producto.investigador,
      }));
      
      // Convertir los datos de proyectos a la misma estructura que productos
      const proyectosAjustados = proyectos.reverse().map(proyecto => ({
        ...proyecto,
        tituloProducto: proyecto.titulo,
        etapa: this.estadosProyectos.find(p => p.id === proyecto.estado).estado,
        id: proyecto.codigo,
        fecha: proyecto.fecha,
        estadoProceso: proyecto.estadoProceso,
        tipo: 'Proyecto',
        observacion: proyecto.observacion,
        investigador: proyecto.investigador,
        // Añadir las demás propiedades según sea necesario
      }));
    
      // Concatenar los datos ajustados de proyectos con los datos de productos
      const combinedData = [...proyectosAjustados, ...productosAjustados];
      
      // Asignar los datos combinados a dataSource
      this.dataSource.data = combinedData;
    });
  }
  
  accionUno(element: any) {
    console.log("Editar")
  }
  
  // ------- plan de trabajo -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------

  displayedColumnas: string[] = ['select', 'titulo', 'tituloproducto','rol', 'horasestricto'];
  displayedColumn: string[] = ['titulo', 'fecha', 'editar','expand'];
  selection = new SelectionModel<any>(true, []);
  expandedElements: any | null = null;
  selectedPlanId: string = '';
  data: any[] = [];

  loadProjectsAndProducts() {
    this.investigatorService.getmostrarPyP().subscribe((data: Person[]) => {
        const userData = this.AutenticacionService.obtenerDatosUsuario();
        const userId = userData ? userData.numerodocumento : '';
        this.data = this.transformData(data, userId);
    });
  }

  @ViewChild('paginator1') paginator1!: MatPaginator; 
  @ViewChild('paginator2') paginator2!: MatPaginator; 

  
  transformData(data: Person[], userId: string): any[] {
    const transformedData: any[] = [];
  
    data.forEach(person => {
      if (person.numerodocumento === userId) {
        person.proyectos.forEach(proyecto => {
          let hasProducts = false;
  
          proyecto.productos.forEach(producto => {
            if (producto.tituloProducto !== 'Sin productos asociados') {
              hasProducts = true;
              transformedData.push({
                nombre: person.nombre,
                correo: person.correo,
                numerodocumento: person.numerodocumento,
                titulo: proyecto.titulo,
                tituloproducto: producto.tituloProducto,
                isSelected: false,  // Inicialmente no seleccionada
                rol: '',  // Inicialmente vacío
                horasestricto: '',  // Inicialmente vacío
                proyectoId: proyecto.codigo,
                productoId: producto.id
              });
            }
          });
  
          if (!hasProducts) {
            transformedData.push({
              nombre: person.nombre,
              correo: person.correo,
              numerodocumento: person.numerodocumento,
              titulo: proyecto.titulo,
              tituloproducto: '',
              isSelected: false,  // Inicialmente no seleccionada
              rol: '',  // Inicialmente vacío
              horasestricto: '',  // Inicialmente vacío
              proyectoId: proyecto.codigo,
              productoId: null
            });
          }
        });
      }
    });
  
    console.log('Datos transformados:', transformedData); // Para depuración
    return transformedData;
  }
  
  obtenerPlanTrabajo() {
  this.ProyectoyproductoService.getconfigplanTrabajo().subscribe(data => {
    console.log('Datos recibidos:', data);
    if (data && data.length > 0) {
      this.idConfiguracion = data[0].id;
    }
    this.dataSourceses.data = data;
    this.dataSourceses.paginator = this.paginator;
  });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceses.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSources.data.forEach(row => {
          row.isSelected = true;
          this.selection.select(row);
        });
  }

  toggleRow(element: any): void {
    this.expandedElements = this.expandedElements === element ? null : element;
    if (this.expandedElements) {
      this.selectedPlanId = this.expandedElements.id;  // Guarda el ID del plan seleccionado
    } else {
      this.selectedPlanId = ' ';
    }
  }

  //rol 
  typerol: string[] = ['Investigador principal', 'Coinvestigador', 'Director'];

  toggleSelection(row: any) {
    row.isSelected = !row.isSelected;
    if (row.isSelected) {
      // Los campos ya están vacíos cuando se selecciona, puedes llenarlos luego
      row.rol = row.rol || '';
      row.horasestricto = row.horasestricto || '';
    } else {
      // Limpiar campos si se deselecciona la fila
      row.rol = '';
      row.horasestricto = '';
    }
    console.log('Fila seleccionada:', {
      isSelected: row.isSelected,
      rol: row.rol,
      horasestricto: row.horasestricto
    });
  }
  
  guardar() {
    const datosAGuardar = this.data
      .filter(row => row.isSelected && row.horasestricto !== undefined)
      .map(row => ({
        configPlanTrabajoId: this.selectedPlanId || this.idConfiguracion,
        horasEstricto: row.horasestricto || 0,
        investigadorId: row.numerodocumento,
        productoId: row.productoId || null,
        proyectoId: row.proyectoId,
        rol: row.productoId ? row.rol : ''
      }));
  
    console.log('Datos para guardar:', datosAGuardar);
  
    const datosValidos = datosAGuardar.filter(dato => dato.productoId ? dato.rol : true);
  
    if (datosValidos.length > 0) {
      this.ProyectoyproductoService.creargetplanTrabajo(datosValidos).subscribe(response => {
        console.log('Datos guardados exitosamente', response);
  
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado el plan de trabajo.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.data.forEach(row => {
            if (row.isSelected) {
              console.log('Enviando notificación para el row:', row);
  
              this.notificar(
                `Plan de trabajo ${row.productoId}${row.proyectoId}`,
                row.numerodocumento,
                this.usuariosAdmin,
                `El plan de trabajo del investigador ${row.numerodocumento} ha sido registrado`
              );
  
              row.isSelected = false;
              row.rol = '';
              row.horasestricto = undefined;
            }
          });
  
          // Retarda la recarga para permitir que se completen las notificaciones
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        });
  
      }, error => {
        console.error('Error al guardar los datos', error);
        Swal.fire({
          title: 'Oops...',
          text: 'Error al guardar el plan de trabajo. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
    } else {
      console.warn('No hay datos seleccionados o completos para guardar');
      Swal.fire({
        title: 'Datos incompletos !!!',
        text: 'Por favor, completa los datos necesarios antes de guardar.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  
  
  editarElemento(data: any = undefined, type:string, detail:boolean): void {
    const dialogRef = this.dialog.open(DialogoEditarPlanTrabajoComponent, {
      data: {
        type: type,
        data: data,
        detail: detail,
        planTrabajoId: data.id //línea para pasar el ID del plan de trabajo
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } 
    });
  }
  
}

