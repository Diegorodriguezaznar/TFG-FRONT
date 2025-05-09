export interface ComentarioDTO {
  idComentario: number;
  texto: string;
  fecha: string;
  idUsuario: number;
  idVideo: number;
  usuario?: {
    idUsuario: number;
    nombre: string;
    apellidos?: string;
    gmail?: string;
    telefono?: string;
  };
}

// Interfaz para el formato de comentario en la UI
export interface ComentarioUI {
  id: number;
  user: string;
  avatar: string;
  content: string;
  likes: number;
  time: string;
  idUsuario: number;
  fechaCreacion: string;
}