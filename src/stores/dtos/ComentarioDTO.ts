export interface ComentarioVideoDTO {
  idComentarioVideo: number;
  contenido: string;
  fechaCreacion: string;
  idUsuario: number;
  idVideo: number;
  usuario?: {
    idUsuario: number;
    nombre: string;
    email?: string;
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