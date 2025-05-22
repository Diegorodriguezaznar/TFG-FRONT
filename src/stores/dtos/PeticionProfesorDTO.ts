export interface PeticionProfesorDTO {
  id: number;
  idUsuario: number;
  documentacionUrl: string;
  texto: string;
  fechaPeticion: string;
  usuario?: {
    idUsuario: number;
    nombre: string;
    apellidos?: string;
    gmail?: string;
    telefono?: string;
  };
}

// Formato para mostrar en la UI
export interface PeticionProfesorUI {
  id: number;
  user: string;
  documentoUrl: string;
  razon: string;
  fecha: string;
  avatar: string;
  idUsuario: number;
}
