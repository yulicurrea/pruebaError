export interface PlanTrabajo {
  horasestricto: number;
  rol: string;
  investigador: Investigador;
  proyecto: Proyecto;
  producto?: any;
}

export interface Investigador {
  nombre: string;
  numerodocumento:String,
  apellidos: string;
  horas_formacion: number;
  Grupoinvestigacion: GrupoInvestigacion;
}

export interface GrupoInvestigacion {
  codigo: string;
  nombre: string;
}

export interface Proyecto {
  codigo: string;
  titulo: string;
  porcentaje_final_semestre: number;
  productos_asociados?: ProductoAsociado; // Opcional
}

export interface ProductoAsociado {
  id:string;
  titulo_producto?: string; // Opcional
  minciencias?: Minciencias; // Opcional
  quartil?: Quartil; // Opcional
  estado_inicio_semestre?: string; // Opcional
  tipo_producto?: string; // Opcional
}

export interface Minciencias {
  id: number;
  categoria: string;
}

export interface Quartil {
  id: number;
  cuartil: string;
}

export interface ConfigPlanTrabajo {
  id: string;
  planTrabajo: PlanTrabajo[];
  fecha: string;
  estado: boolean;
  titulo: string;
}
