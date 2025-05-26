export interface RespuestaDTO {
  idRespuesta: number;
  texto: string;
  esCorrecta: boolean;
  orden: number;
  idPregunta: number;
}