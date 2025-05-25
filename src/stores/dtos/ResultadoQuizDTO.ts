export interface ResultadoQuizDTO {
  idResultado?: number;
  idQuiz: number;
  idUsuario: number;
  puntuacion: number;
  fechaRealizacion: string;
  respuestasUsuario: RespuestaUsuarioDTO[];
}

export interface RespuestaUsuarioDTO {
  idPregunta: number;
  idRespuestaSeleccionada: number;
  esCorrecta: boolean;
}