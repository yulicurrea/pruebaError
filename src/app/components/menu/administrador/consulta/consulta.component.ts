import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { InvestigadorService } from '../../services/registroInvestigador';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from '../../services/search.service';
import { ProyectoyproductoService } from '../../services/proyectoyproducto';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { DialogoEstadisticaComponent } from './dialogo-estadistica/dialogo-estadistica.component';
import { DialogoTrazabilidadComponent } from './dialogo-trazabilidad/dialogo-trazabilidad.component';
import { DialogoPlanDeTrabajoComponent } from './dialogo-plan-de-trabajo/dialogo-plan-de-trabajo.component';
import { DialogoInformacionPlanTrabajoComponent } from './dialogo-informacion-plan-trabajo/dialogo-informacion-plan-trabajo.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EstudiantesService } from '../../services/estudiantes';
import { ParticipantesExternosService } from '../../services/participantesExternos';
import { DialogoDetalleComponent } from '../control/dialogo-detalle/dialogo-detalle.component';
import { DialogoEditarFechaComponent } from './dialogo-editar-fecha/dialogo-editar-fecha.component';
import { HttpErrorResponse } from '@angular/common/http';
import {  Observable, catchError, of} from 'rxjs';
import {  switchMap,  } from 'rxjs/operators';
import { AutenticacionService } from '../../services/autenticacion';
import { ConfiguracionPlanTrabajo } from '../../modelo/planDeTrabajo';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
  standalone: true,
  imports: [
    MatTabsModule, 
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule, 
    FormsModule
  ],
})
export class ConsultaComponent implements OnInit, AfterViewInit {
  @ViewChild('TABLE') table: any;
  dataSourceInvestigador: MatTableDataSource<any>;
  dataSourceProyecto: MatTableDataSource<any>;
  dataSourceProducto: MatTableDataSource<any>;
  dataSourcePlanTrabajo: MatTableDataSource<any>;

  displayedColumnsInvestigador: string[] = ['nombre', 'rolinvestigador', 'estado','updated_at','created_at','accion'];
  displayedColumnsProyecto: string[] = ['codigo', 'lider','lineaInvestigacion','estadoProceso','estadoProyecto','updated_at','created_at','accion'];
  displayedColumnsProducto: string[] = ['nombre', 'lider','estadoProceso','estadoProducto','updated_at','created_at','accion'];

  proyectosData: any[] =[];
  productosData: any[] =[];
  investigadoresData: any[] =[];

  expandedDetail = false;
  expandedDetailProducto = false;


  estadosProyectos: any[] = [];
  estadosProductos: any[] = [];

  tableHeaders = {
    planTrabajo: 'Plan de trabajo',
    informacion: 'Información',
    descargar: 'Descargar',
    estado: 'Estado',
    fecha:'Fecha',
    editar:'Editar Titulo y Fecha'
  };

  item: any[] =[];

  constructor(
    private AutenticacionService:AutenticacionService,
    private investigadorService: InvestigadorService, 
    private searchService: SearchService,
    private _snackBar: MatSnackBar,
    private proyectoyproductoService: ProyectoyproductoService,
    private estudiantesService: EstudiantesService,
    private participantesExternosService: ParticipantesExternosService,
    public dialog: MatDialog) {
    
    this.dataSourceInvestigador = new MatTableDataSource<any>([]);
    this.dataSourceProyecto = new MatTableDataSource<any>([]);
    this.dataSourceProducto = new MatTableDataSource<any>([]);
    this.dataSourcePlanTrabajo = new MatTableDataSource<any>([]);
  }

  @ViewChild('paginatorInvestigador') paginator!: MatPaginator;
  @ViewChild('paginatorProyecto') paginator2!: MatPaginator;
  @ViewChild('paginatorProducto') paginator3!: MatPaginator;
  @ViewChild('paginatorPlanTrabajo') paginator4!: MatPaginator;

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerPlanTrabajo();
    this.obtenerProyectos();
    this.obtenerProductos();
    
    this.searchService.getSearchQuery().subscribe(query => {
      this.dataSourceInvestigador.filter = query.trim().toLowerCase();
      this.dataSourceProyecto.filter = query.trim().toLowerCase();
      this.dataSourceProducto.filter = query.trim().toLowerCase();
      this.dataSourcePlanTrabajo.filter = query.trim().toLowerCase();
    });
  }

  ngAfterViewInit() {
    this.dataSourceInvestigador.paginator = this.paginator;
    this.dataSourceProyecto.paginator = this.paginator2;
    this.dataSourceProducto.paginator = this.paginator3;
    this.dataSourcePlanTrabajo.paginator = this.paginator4;

  }

  getNombreCompleto(id: string | number, lista: any[]): string {
    const persona = lista.find(u => u.numerodocumento === id || u.id === id);
    return persona ? `${persona.nombre} ${persona.apellidos}` : String(id);  
  }

  obtenerProyectos() {
    forkJoin({
      proyectos: this.proyectoyproductoService.getProyectos(),
      estados: this.proyectoyproductoService.obtenerEstadosProyecto(),
      usuarios: this.investigadorService.getUsuarios(),
      estudiantes: this.estudiantesService.getEstudiantes(),
      participantesExternos: this.participantesExternosService.getParticipantesExternos()

    }).subscribe(
      ({proyectos , estados, usuarios, estudiantes, participantesExternos}) => {

        this.estadosProyectos = estados;
        const dataSort = proyectos.sort((a, b) => (a.codigo < b.codigo ? -1 : 1));
        this.dataSourceProyecto.data = dataSort.map(data => {
        const estadoProyecto = this.estadosProyectos.find(x => x.id == data.estadoProyecto);

    
          return {
            codigo: data.codigo,
            investigador: this.getNombreCompleto(data.investigador, usuarios),
            lineaInvestigacion: data.lineaInvestigacion,
            observacion: data.observacion,
            estadoProceso: data.estadoProceso,
            estadoProyecto: this.estadosProyectos.filter(x => x.id == data.estado)[0].estado,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        });
        this.proyectosData = dataSort.map(data => {
        
          return {
            codigo: data.codigo,
            titulo: data.titulo,
            investigador: this.getNombreCompleto(data.investigador, usuarios),
            coinvestigador: Array.isArray(data.coinvestigador) 
              ? data.coinvestigador.map((id: string | number) => this.getNombreCompleto(id, usuarios)).join(', ')
              : this.getNombreCompleto(data.coinvestigador, usuarios),
            estudiantes: Array.isArray(data.estudiantes) 
              ? data.estudiantes.map((id: string | number) => this.getNombreCompleto(id, estudiantes)).join(', ')
              : this.getNombreCompleto(data.estudiantes, estudiantes),
            participantesExternos: Array.isArray(data.participantesExternos) 
              ? data.participantesExternos.map((id: string | number) => this.getNombreCompleto(id, participantesExternos)).join(', ')
              :this.getNombreCompleto(data.participantesExternos, participantesExternos),
            unidadAcademica: data.unidadAcademica,
            area: data.area,
            porcentajeEjecucionCorte: data.porcentajeEjecucionCorte,
            grupoInvestigacionPro: data.grupoInvestigacionPro,
            porcentajeEjecucionFinCorte: data.porcentajeEjecucionFinCorte,
            porcentajeAvance: data.porcentajeAvance,
            observacion: data.observacion,
            Soporte: data.Soporte,
            origen: data.origen,
            convocatoria: data.convocatoria,
            modalidad: data.modalidad,
            nivelRiesgoEtico: data.nivelRiesgoEtico,
            lineaInvestigacion: data.lineaInvestigacion,
            estadoProceso: data.estadoProceso,
            estadoProyecto: this.estadosProyectos.filter(x => x.id == data.estado)[0].estado,
            producto: Array.isArray(data.producto) ? data.producto.join(', ') : 'Producto no disponible',
            created_at: data.created_at,
            updated_at: data.updated_at
          };
        });
      },
      (error) => {
        console.error('Error al obtener proyectos:', error);
      }
    );
  }

  obtenerProductos() {
    forkJoin({
      productos: this.proyectoyproductoService.getProductos(),
      estados: this.proyectoyproductoService.obtenerEstadosProducto(),
      usuarios: this.investigadorService.getUsuarios(),
      estudiantes: this.estudiantesService.getEstudiantes(),
      participantesExternos: this.participantesExternosService.getParticipantesExternos()

    }).subscribe(
      ({ productos, estados, usuarios, estudiantes, participantesExternos }) => {
        this.estadosProductos = estados;
        
        const dataSort = productos.sort((a, b) => (a.id < b.id ? -1 : 1));
        this.dataSourceProducto.data = dataSort.map(data => {
          const estadoProducto = this.estadosProductos.find(x => x.id == data.estadoProducto);
          return {
            id: data.id,
            investigador: this.getNombreCompleto(data.investigador, usuarios),
            estadoProceso: data.estadoProceso,
            estadoProducto: estadoProducto ? estadoProducto.estado : 'Desconocido',
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        });
  
        this.productosData = dataSort.map(data => {
          
          return {
            id: data.id,
            Soporte: data.Soporte,
            tituloProducto: data.tituloProducto,
            investigador: this.getNombreCompleto(data.investigador, usuarios),
            coinvestigador: Array.isArray(data.coinvestigador) 
              ? data.coinvestigador.map((id: string | number) => this.getNombreCompleto(id, usuarios)).join(', ')
              : this.getNombreCompleto(data.coinvestigador, usuarios),
            estudiantes: Array.isArray(data.estudiantes) 
              ? data.estudiantes.map((id: string | number) => this.getNombreCompleto(id, estudiantes)).join(', ')
              : this.getNombreCompleto(data.estudiantes, estudiantes),
            participantesExternos: Array.isArray(data.participantesExternos) 
              ? data.participantesExternos.map((id: string | number) => this.getNombreCompleto(id, participantesExternos)).join(', ')
              :this.getNombreCompleto(data.participantesExternos, participantesExternos),
            publicacion: data.publicacion,
            porcentanjeAvanFinSemestre: data.porcentanjeAvanFinSemestre,
            observaciones: data.observaciones,
            porcentajeComSemestral: data.porcentajeComSemestral,
            porcentajeRealMensual: data.porcentajeRealMensual,
            origen: data.origen,
            observacion: data.observacion,
            estadoProceso: data.estadoProceso,
            estadoProducto: this.estadosProductos.filter(x => x.id == data.estadoProducto)[0].estado,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        });
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  obtenerUsuarios() {
    this.investigadorService.getUsuarios().subscribe(
      (usuarios) => {
        const dataSort = usuarios.sort((a, b) => (a.nombre < b.nombre ? -1 : 1));
        this.dataSourceInvestigador.data = dataSort;
        this.investigadoresData = dataSort.map(data => {
          return {
            tipodocumento: data.tipodocumento,
            numerodocumento: data.numerodocumento,
            correo: data.correo,
            nombre: data.nombre,
            apellidos: data.apellidos,
            estado: data.estado ? 'Activo' : 'Inactivo',
            horasestricto: data.horasestricto,
            horasformacion: data.horasformacion,
            categoriaminciencias: data.categoriaminciencias,
            rolinvestigador: data.rolinvestigador,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
        });
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerEstadosProyecto() {
    this.proyectoyproductoService.obtenerEstadosProyecto().subscribe(
      (proyecto) => {
        this.estadosProyectos = proyecto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerEstadosProducto() {
    this.proyectoyproductoService.obtenerEstadosProducto().subscribe(
      (producto) => {
        this.estadosProductos = producto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  exportAsXLSX(data: any = undefined, tipo: string): void {
    let filter: any[] = [];
    switch(tipo) { 
      case 'Proyectos': {
        if(data == undefined){
          filter = this.proyectosData;
        } else {
          filter = this.proyectosData.filter(x => x.codigo == data.codigo);
        }
        break; 
      } 
      case 'Productos': {
        if(data == undefined){
          filter = this.productosData;
        } else {
          filter = this.productosData.filter(x => x.id == data.id);
        }
        break; 
      } 
      default: {        
        if(data == undefined){
          filter = this.investigadoresData;
        } else {
          filter = this.investigadoresData.filter(x => x.numerodocumento == data.numerodocumento);
        }
        break; 
      } 
    } 
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filter);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tipo);
    XLSX.writeFile(wb, `Reporte${tipo}.xls`);
  }

  openDialogoEstadistica(data: any = undefined, type:string, detail:boolean): void {
    const dialogRef = this.dialog.open(DialogoEstadisticaComponent, {
      data: {
        type: type,
        data: data,
        detail: detail,
      },
      width: '60%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } 
    });
  }

  //PLAN DE TRABAJO
  openDialogoPlanTrabajo(data: any = undefined, type:string, detail:boolean): void {
    const dialogRef = this.dialog.open(DialogoPlanDeTrabajoComponent, {
      data: {
        type: type,
        data: data,
        detail: detail,
      },
      width: '20%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload(); // Esto recargará toda la página

      } 
    });
  }

  openDialogoInformacionPlanTrabajo(data: any = undefined, type:string, detail:boolean): void {
    const dialogRef = this.dialog.open(DialogoInformacionPlanTrabajoComponent, {
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

  cambiarEstadoPlanTrabajo(item: any): void {
    // Asegúrate de que 'item' tenga el campo 'id'
    if (!item.id) {
      console.error('ID del plan de trabajo no está definido');
      return;
    }
    
    // Cambia el estado
      item.estado_manual = !item.estado_manual;
  
    // Llama al servicio para actualizar el estado
    this.proyectoyproductoService.editarconfigplanTrabajo(item).subscribe(
      () => {
        this._snackBar.open('Registro actualizado correctamente', 'Estado', {
          duration: 2000,
        });
        console.log('Estado actualizado correctamente');
        this.ngOnInit(); // Refresca los datos
      },
      (error) => {
        console.error('Error al actualizar estado:', error);
      }
    );
  }

  
  obtenerPlanTrabajo() {
    this.proyectoyproductoService.getconfigplanTrabajo().subscribe(data => {
      const sortedData = data.sort((a, b) => {
        if (a.estado_fecha === b.estado_fecha) {
          return 0;
        }
        return a.estado_fecha ? -1 : 1;
      });
  
      this.dataSourcePlanTrabajo.data = sortedData.map(x => ({
        id: x.id,
        plan: x.titulo, // Aquí asegúrate de que 'titulo' esté presente en los datos originales
        estado: x.estado,
        estado_manual: x.estado_manual,
        estado_fecha: x.estado_fecha,
        fecha: x.fecha,
        planTrabajo: x.planTrabajo
      }));
      
      this.dataSourcePlanTrabajo.paginator = this.paginator4; // Asegúrate de esto
    });
  }
  
  openDialogoEditarFecha(item: any): void {
    const dialogRef = this.dialog.open(DialogoEditarFechaComponent, {
      width: '300px',
      data: { id: item.id, fecha: item.fecha , titulo: item.plan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proyectoyproductoService.editarconfigplanTrabajo(result).subscribe(
          () => {
            this._snackBar.open('Fecha y Título actualizados correctamente', 'Cerrar', {
              duration: 2000,
            });
            this.obtenerPlanTrabajo(); // Refresh the data
            this.notificarInvestigadores(result).subscribe(
              () => {
                console.log('Notificaciones enviadas exitosamente.');
              },
              error => {
                console.error('Error al enviar notificaciones:', error);
              }
            );
          },
          error => {
            console.error('Error al actualizar la fecha y el Titulo:', error);
            this._snackBar.open('Error al actualizar la fecha y el Titulo', 'Cerrar', {
              duration: 2000,
            });
          }
        );
      }
    });
  }
 
  notificarInvestigadores(planTrabajo: ConfiguracionPlanTrabajo): Observable<any> {
    const usuarioActualDocumento = this.AutenticacionService.obtenerDatosUsuario().numerodocumento;
  
    return this.investigadorService.getInvestigadores().pipe(
      switchMap(investigadores => {
        const investigadoresFiltrados = investigadores.filter(
          investigador => investigador.numerodocumento !== usuarioActualDocumento
        );
  
        if (investigadoresFiltrados.length === 0) {
          console.log('No hay investigadores para notificar.');
          return of([]); // Retorna un observable vacío si no hay investigadores para notificar
        }
  
        const notificaciones = investigadoresFiltrados.map(investigador => {
          const notificacion = {
            asunto: ' Plan de Trabajo',
            mensaje: `Se ha modificado la fecha del plan de trabajo: ${planTrabajo.titulo}. Fecha límite: ${planTrabajo.fecha}`,
            remitente: usuarioActualDocumento,
            destinatario: investigador.numerodocumento,
            estado: 'no leído'
          };
          return this.enviarNotificacion(notificacion);
        });
  
        return forkJoin(notificaciones);
      })
    );
  }
  
  enviarNotificacion(notificacion: any): Observable<any> {
    return this.proyectoyproductoService.notificar(notificacion).pipe(
      catchError(error => {
        console.error('Error al enviar la notificación:', error);
        return of(null); // Retorna un observable vacío para que forkJoin no se detenga
      })
    );
  }

  descargarPlanTrabajo(item: any): void {
    if (Array.isArray(item.planTrabajo) && item.planTrabajo.length > 0) {
        // Obtener todos los proyectos, productos e investigadores
        const proyectos$ = this.proyectoyproductoService.getProyectos();
        const productos$ = this.proyectoyproductoService.getProductos();
        const investigadores$ = this.investigadorService.getUsuarios();
        const grupos$ = this.investigadorService.getgrupos();
        const cuartil$ = this.proyectoyproductoService.getCuartilEsperado();
        const minciencias$ = this.proyectoyproductoService.getCategoria();

        forkJoin([proyectos$, productos$, investigadores$, grupos$, cuartil$, minciencias$]).subscribe(([proyectos, productos, investigadores, grupos, cuartiles, minciencias]) => {
          const datosProcesados = item.planTrabajo.map((pt: any) => {
            // Encontrar los datos correspondientes
            const investigador = investigadores.find((i: any) => i.numerodocumento === pt.investigador);
            const grupo = grupos.find((p: any) => p.id === pt.grupo);
            const proyecto = proyectos.find((p: any) => p.codigo === pt.proyecto);
            const producto = productos.find((p: any) => p.id === pt.producto) || {};
            const quartil = cuartiles.find((p: any) => p.id === producto.cuartilEsperado);
            const categoria = minciencias.find((p: any) => p.id === producto.categoriaMinciencias);
        
            return {
                Grupo: grupo?.nombre || 'Sin grupo',
                'Nombre del investigador': `${investigador?.nombre || 'Nombre no disponible'} ${investigador?.apellidos || ''}`.trim(),
                'Horas de investigación formación': investigador?.horas_formacion || 0,
                'Horas de investigación sentido estricto': pt.horasestricto || 0,
                'Código de proyecto': proyecto?.codigo || 'Código no disponible',
                'Titulo de proyecto': proyecto?.titulo || 'Título no disponible',
                'Tipo de producto': producto.tipo_producto || '',
                'Rol en producto': pt.rol || '',
                'Titulo de producto': producto.tituloProducto || '',
                Categoria: categoria?.categoria || '',
                Quartil: quartil?.cuartil || '',
                'Estado del producto al inicio del semestre': producto.estadoProceso || '',
                'Porcentaje de avances para final semestre': proyecto?.porcentaje_final_semestre || 0
            };
        });
        
            // Exportar los datos a Excel
            if (datosProcesados.length > 0) {
                const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosProcesados);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Datos Exportados');
                XLSX.writeFile(wb, `datos_plan_trabajo_${item.id}.xlsx`);
            } else {
                console.warn(`El plan de trabajo con id ${item.id} no tiene datos relevantes para procesar.`);
            }
        }, error => {
            console.error('Error al obtener datos:', error);
        });
    } else {
        console.warn(`El plan de trabajo con id ${item.id} no tiene datos para procesar.`);
    }
}


convertToCSV(objArray: any[]) {
  const array = [Object.keys(objArray[0])].concat(objArray);
  return array.map(it => {
      return Object.values(it).toString();
  }).join('\n');
}

downloadCSV(csvContent: string, fileName: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
}


openDialogoDetalle(data: any, tipo: string): void {
  let dialogData;
  
  // Agrega logs para verificar los datos iniciales
  console.log('Datos de entrada:', data);
  console.log('Tipo:', tipo);

  if (tipo === 'Proyecto') {
    // Asegúrate de que `this.proyectosData` esté bien poblado
    console.log('Datos de proyectos:', this.proyectosData);
    
    dialogData = this.proyectosData.find(x => x.codigo === data.codigo);
  } else {
    // Asegúrate de que `this.productosData` esté bien poblado
    console.log('Datos de productos:', this.productosData);
    
    dialogData = this.productosData.find(x => x.id === data.id);
  }

  // Verifica el resultado de la búsqueda
  console.log('Resultado de la búsqueda:', dialogData);

  // Asegúrate de que los campos de selección múltiple sean arrays
  if (dialogData) {
    dialogData.coinvestigador = Array.isArray(dialogData.coinvestigador) ? dialogData.coinvestigador : [];
    dialogData.estudiantes = Array.isArray(dialogData.estudiantes) ? dialogData.estudiantes : [];
    dialogData.participantesExternos = Array.isArray(dialogData.participantesExternos) ? dialogData.participantesExternos : [];
    
    console.log('Datos del diálogo después de la verificación:', dialogData); // Verifica los datos después de la conversión
  } else {
    console.error('No se encontró dialogData');
  }

  const dialogRef = this.dialog.open(DialogoDetalleComponent, {
    data: {
      title: 'Detalle ' + tipo,
      buttonTitle: 'CREAR',
      type: tipo,
      data: dialogData,
      isEdit: false 
    },
    disableClose: true,
    panelClass: "dialog-responsive"
  });

}

// Trazabilidad
openDialogoTrazabilidad(data: any, type: string, detail: boolean): void {
  const dialogRef = this.dialog.open(DialogoTrazabilidadComponent, {
    data: {
      type: type,
      data: data,
      detail: detail,
    },
    width: '80%',
    height: '90%',
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
    }
  });
}

}
 