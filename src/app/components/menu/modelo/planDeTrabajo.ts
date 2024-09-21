export interface PlanTrabajo{
    horasestricto?: number,
    rol: string,
    investigador?: string,
    proyecto?: string,
    producto: string
}

export interface ConfiguracionPlanTrabajo{
    fecha?: string | Date;
    estado?: string,
    titulo?: string,
}


//mostrar plan de trabajo
export interface GrupoInvestigacion {
    codigo: string;
    nombre: string;
}

export interface Investigador {
    numerodocumento: string;
    nombre: string;
    apellidos: string;
    horas_formacion: number;
    Grupoinvestigacion: GrupoInvestigacion;
}

export interface Minciencias {
    id: number;
    categoria: string;
}

export interface Quartil {
    id: number;
    cuartil: string;
}

export interface ProductoAsociado {
    titulo_producto: string;
    minciencias: Minciencias;
    quartil: Quartil;
    estado_inicio_semestre: string;
    tipo_producto: string; 
}


export interface Proyecto {
    codigo: string;
    titulo: string;
    porcentaje_final_semestre: number;
    productos_asociados: ProductoAsociado;
}

export interface PlanDeTrabajo {
    id: string;
    horasestricto: number;
    rol: string;
    investigador: Investigador;
    proyecto: Proyecto;
}

export interface MostrarPlan {
    id: string;
    planTrabajo: PlanDeTrabajo[];
    fecha: string;
    estado: boolean;
    titulo: string;
}

export interface PlanTableData {
    id: number;
    name: string;
    weight: string;
    symbol: number;
    estricto: number;
    codigo: string;
    tituloProyecto: string;
    tipoProducto: string;
    rol: string;
    tituloProducto: string;
    categoria: string;
    quartil: string;
    estado: string;
    avance: number;
  }
  
  export interface DetallePlan {
    Grupo: string;
    Nombre_del_investigador: string;
    Horas_de_investigacion_formacion: number;
    Horas_de_investigacion_sentido_estricto: number;
    Codigo_de_proyecto: string;
    Titulo_de_proyecto: string;
    Tipo_de_producto: string;
    Rol_en_producto: string;
    Titulo_de_producto: string;
    Categoria: string;
    Quartil: string;
    Estado_del_producto_al_inicio_del_semestre: string;
    Porcentaje_de_avances_para_final_semestre: number;
  }

  export interface PlanDeTrabajos {
    id: number;
    titulo: string;
    estado: boolean;
    planTrabajo: PlanDeTrabajo[];
  }
  
  export interface PlanDeTrabajoUpdate {
    id: string;
    rol: string;
    horasestricto: number;
  }
  