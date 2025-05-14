// FRONTEND: TFG-FRONT/src/stores/dtos/AuthDTO.ts
export interface RegistroDTO {
    nombre: string;
    apellidos?: string;
    gmail: string;
    telefono?: string;
    contraseña: string;
    idRol?: number;
}

export interface LoginDTO {
    gmail: string;
    contraseña: string;
}

export interface AuthResponseDTO {
    idUsuario: number;
    nombre: string;
    token: string;
    rol: string;
}