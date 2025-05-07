export interface VideoDTO {
    idVideo: number;
    titulo: string;
    descripcion?: string;
    url: string;
    miniatura?: string;
    fechaSubida: string;
    idAsignatura: number;
    asignatura?: string; // Nombre de la asignatura (para mostrar)
    idUsuario: number;
    autor?: string; // Nombre del profesor/usuario (para mostrar)
    idCurso?: number; // Curso al que pertenece el video (opcional)
    vistas?: string; // Para mostrar en la UI (no está en la tabla)
    fecha?: string; // Fecha formateada para mostrar (ej: "Hace 2 días")
  }