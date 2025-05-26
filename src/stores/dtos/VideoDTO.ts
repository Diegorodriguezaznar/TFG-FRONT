export interface VideoDTO {
  idVideo: number;
  titulo: string;
  descripcion: string;
  url: string;
  miniatura: string;
  fechaSubida: string;
  idAsignatura: number;
  asignatura: string;
  idUsuario: number;
  autor: string;
  idCurso: number;
  duracion: string;
  vistas: string;
  fecha: string;
  numReportes?: number;
  contadorLikes?: number; 
}
