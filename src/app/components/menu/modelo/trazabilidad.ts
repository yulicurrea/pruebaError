export interface Notificacion {
    id: string | null;
    asunto: string;
    remitente: string;
    destinatario: string;
    mensaje: string;
    estado: boolean;
    created_at: string;
    updated_at?: string; // Este campo es opcional si no siempre está presente
  }
  