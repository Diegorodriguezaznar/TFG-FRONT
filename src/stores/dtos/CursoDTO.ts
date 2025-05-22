export interface CursoDTO {
  idCurso: number;
  nombre: string;
  imagen: string | null;
  descripcion: string | null;
  fechaCreacion: string;
  asignaturas: any[]; 
  usuarioCursos: any[];
}