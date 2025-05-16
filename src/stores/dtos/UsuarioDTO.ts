export interface UsuarioDTO {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  gmail: string;
  telefono: string;
  avatar: string;
  idRol: number;
  idPreferencia: number | null;
  contraseña: string; 
}
