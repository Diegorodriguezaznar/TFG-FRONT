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
//TODO FRAN ESTO ES POR SI NO ME PILLA BIEN LOS DATOS ES "OTRA FORMA DE AGARRARLO" COMO MIS PELOTAS 
export interface ResultadoQuizCreateDTO {
  idQuiz: number;
  idUsuario: number;
  puntuacion: number;
  fechaRealizacion: string;
  respuestas: {
    idPregunta: number;
    idRespuesta: number;
    correcta: boolean;
  }[];
}

export interface ResultadoQuizSimpleDTO {
  quizId: number;
  userId: number;
  score: number;
  completedAt: string;
}