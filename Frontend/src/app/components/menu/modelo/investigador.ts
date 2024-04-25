export interface Investigador {
    nombre?: string;
    apellidos?: string;
    correo?: string;
    contrasena?: string;
    numerodocumento?: string;
    tipodocumento?: string;
    horasestricto?: number;
    horasformacion?: number;
    unidadAcademica?: string;
    escalofonodocente?: string;
    rolinvestigador?: string;
    lineainvestigacion?: string;
    ies?: string;
    tipPosgrado?: number;
    tipPregrado?: number;
    grupoinvestigacion?: number;
    ubicacion?: number;
    imagen?: number;
}

export interface Grupoinvestigacion{
    codigo?:string;
    nombre?:string;
}