export interface UsuarioSesion {
    apellidos: string;
    correo: string;
    escalofonodocente: string;
    horariosestrictos: number;
    horariosformacion: number;
    lineainvestigacion: string;
    nombre: string;
    numerodocumento: string;
    tipodocumento: string;
    tipoPosgrado: TipPosgrado;
    tipPregrado: TipPregrado;
    unidadAcademica: string;
}

export interface TipPosgrado{
    fecha:string;
    id:string;
    institucion:string;
    tipo:string;
    titulo:string;
}

export interface TipPregrado{
    fecha:string;
    id:string;
    institucion:string;
    titulo:string;
}