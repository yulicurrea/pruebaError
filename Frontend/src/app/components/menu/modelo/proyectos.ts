
export interface Eventos {
  id?: string;
  fechainicio?: string;
  fechafin?: string;
  numparticinerno?: number;
  numparticexterno?: number;
  tipoevento?: string;
}
export interface Articulos {
  id?: string;
  fuente?: string;
}
export interface Capitulos {
  id?: string;
  nombrepublicacion?: string;
  isbn?: string;
  fecha?: Date;
  editorial?: string;
}
export interface Libros {
  id?: string;
  isbn?: string;
  fecha?: Date;
  editorial?: string;
  luegarpublicacion?: string;
}
export interface Software {
  id?: string;
  tiporegistro?: string;
  numero?: string;
  fecha?: Date;
  pais?: string;
}
export interface Industrial {
  id?: string;
  fecha?: Date;
  pais?: string;
  insitutofinanciador?: string;
}
export interface Reconocimientos {
  id?: string;
  fecha?: Date;
  nombentidadotorgada?: string;
}
export interface Licencia {
  id?: string;
  nombre?: string;
}
export interface Apropiacion {
  id?: string;
  fechainicio?: Date;
  fechaFin?: Date;
  licencia?: Licencia;
  formato?: string;
  medio?: string;
  nombreEntidad?: string;
}
export interface Contrato {
  id?: string;
  nombre?: string;
  numero?: string;
}
export interface Consultoria {
  id?: string;
  año?: Date;
  contrato?: Contrato;
  nombreEntidad?: string;
}
export interface Contenido {
  id?: string;
  paginaWeb?: string;
  nombreEntidad?: string;
}
export interface PregFinalizadoyCurso {
  id?: string;
  fechaInicio?: Date;
  reconocimientos?: string;
  numeroPaginas?: number;
}
export interface Maestria {
  id?: string;
  fechaInicio?: Date;
  institucion?: string;
}
export interface ListaProducto {
  id?: string;
  articulo?: Articulos;
  capitulo?: Capitulos;
  software?: Software;
  libro?: Libros;
  prototipoIndustrial?: Industrial
  evento?: Eventos;
  reconocimiento?: Reconocimientos;
  consultoria?: Consultoria;
  contenido?: Contenido;
  pregFinalizadoyCurso?: PregFinalizadoyCurso;
  apropiacion?: Apropiacion;
  maestria: Maestria;
  proyectoCursoProducto?: string;
  proyectoFormuladoProducto?: string;
  proyectoRSUProducto?: string;
}
export interface RolProducto {
  id?: string;
  rol?: number;
}
export interface CuartilEsperado {
  id?: string;
  cuartil?: number;
}
export interface CategoriaMinciencias {
  id?: string;
  categoria?: string;
}
export interface Estudiantes {
  nombres?: string;
  apellidos?: string;
  semestre?: number;
  fechaGrado?: Date;
  codigoGrupo?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
}
export interface EstadoProducto {
  id?: string;
  estado?: string;
}
export interface Producto {
  id?: string;
  tituloProducto?: string;
  investigador ?: string;
  listaProducto ?: ListaProducto;
  tipologiaProducto?: string;
  publicacion?: string;
  estudiantes?:String;
  estadoProdIniSemestre?: string;
  porcentanjeAvanFinSemestre?: number;
  observaciones?: string;
  estadoProducto?: string;
  porcentajeComSemestral?: number;
  porcentajeRealMensual?: number;
  fecha?: string | Date;
  origen?: string;
  Soporte?: File;
  estudiantesProducto?: Estudiante[];
  participantesExternosProducto?: ParticipanteExterno[];
  coinvestigadoresProducto?: Coinvestigador[];
}

//--------------------------------------------------- Proyecto --------------------
export interface EntregableAdministrativo {
  id?: string;
  titulo?: string;
  nombre?: string;
  calidad?: string;
  entregable?: string;
  pendiente?: string;
  clasificacion?: string;
}
export interface Coinvestigador {
  id?: string;
  coinvestigador?: string;
  correo?: string;
}

export interface financiacion{
  id?:string;
  valorPropuestoFin?: string;
  valorEjecutadoFin?: string;
}

export interface entidadPostulo{
  id?:string;
  nombreInstitucion?:string;
  nombreGrupo?:string;
}
export interface transacciones{
  id?: string;
  fecha?: Date;
  acta?: string;
  descripcion?: string;
}
export interface ubicacionProyecto{
  id?: string;
  instalacion?: string;
  municipio?: string;
  pais?: string;
  departamento?: string;
}
export interface Proyecto {
  codigo?: string;
  fecha?: Date | string;
  titulo?: string;
  investigador?: string;
  unidadAcademica?: string;
  producto?: Producto;
  coinvestigadores?: Coinvestigador[];
  area?: string;
  porcentajeEjecucionCorte?: number;
  entidadPostulo?: entidadPostulo;
  financiacion?: financiacion;
  grupoInvestigacionPro?: string;
  porcentajeEjecucionFinCorte?: number;
  porcentajeAvance?: number;
  soporte?: File;
  soporteProducto?: File;
  transacciones?: transacciones;
  origen?: string;
  convocatoria?: string;
  ubicacionProyecto?: ubicacionProyecto;
  estadoProyecto?: string;
  estadoProceso?: string;
  modalidadProyecto?: string;
  nivelRiesgoEtico?: string;
  lineaInvestigacion?: string;
  estudiantes?: Estudiante[];
  participantesExternos?: ParticipanteExterno[];
  estado?: string;
}

export interface Estudiante {
  numeroDocumento?: string;
  nombres?: string;
  apellidos?: string;
  semestre?: number;
  fechaGrado?: Date;
  codigoGrupo?: string;
  tipoDocumento?: string;
}

export interface ParticipanteExterno {
  numerodocumento?: string;
  nombre?: string;
  apellidos?: string;
  institucion?: number;
}
