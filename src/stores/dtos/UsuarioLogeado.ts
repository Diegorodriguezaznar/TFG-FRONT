// FRONTEND: TFG-FRONT/src/stores/UsuarioLogeado.ts
import { defineStore } from "pinia";
import { ref } from "vue";

// Interfaz para el usuario
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos?: string;
  gmail: string;
  telefono?: string;
  idRol?: number;
  rol?: { 
    idRol?: number;
    id?: number;
    nombre?: string;
  };
}

// Interfaces para autenticación
export interface LoginDTO {
  gmail: string;
  contraseña: string;
}

export interface RegistroDTO {
  nombre: string;
  apellidos?: string;
  gmail: string;
  telefono?: string;
  contraseña: string;
  idRol?: number;
}

export interface AuthResponseDTO {
  idUsuario: number;
  nombre: string;
  token: string;
  rol: string;
}

export const useUsuarioLogeadoStore = defineStore("usuarioLogeado", () => {
  // Estado del usuario actual
  const usuarioActual = ref<Usuario | null>(null);
  const estaAutenticado = ref(false);
  const errorMessage = ref("");
  const token = ref<string | null>(null);

  // Recuperar usuario desde localStorage al iniciar
  function cargarUsuarioDesdeStorage() {
    const usuarioGuardado = localStorage.getItem("user");
    const tokenGuardado = localStorage.getItem("token");
    
    if (usuarioGuardado && tokenGuardado) {
      try {
        usuarioActual.value = JSON.parse(usuarioGuardado);
        token.value = tokenGuardado;
        estaAutenticado.value = true;
        console.log("Usuario cargado desde localStorage:", usuarioActual.value);
      } catch (error) {
        console.error("Error al recuperar usuario:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }

  // Iniciar sesión (versión actualizada)
  async function login(datos: LoginDTO): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:5190/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorText = await response.text();
        errorMessage.value = errorText || "Credenciales inválidas";
        return false;
      }

      const authResponse: AuthResponseDTO = await response.json();
      
      // Crear objeto de usuario a partir de la respuesta
      const usuario: Usuario = {
        idUsuario: authResponse.idUsuario,
        nombre: authResponse.nombre,
        gmail: datos.gmail,
        rol: { 
          nombre: authResponse.rol,
          // Asumimos que rol 1 es Admin y cualquier otro es usuario normal
          idRol: authResponse.rol.toLowerCase() === 'admin' ? 1 : 2
        }
      };

      usuarioActual.value = usuario;
      token.value = authResponse.token;
      estaAutenticado.value = true;
      errorMessage.value = "";

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(usuario));
      localStorage.setItem("token", authResponse.token);
      
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al iniciar sesión";
      return false;
    }
  }

  // Registro de usuario
  async function registro(datos: RegistroDTO): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:5190/api/Auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorText = await response.text();
        errorMessage.value = errorText || "Error al registrarse";
        return false;
      }

      const authResponse: AuthResponseDTO = await response.json();
      
      // Crear objeto de usuario a partir de la respuesta
      const usuario: Usuario = {
        idUsuario: authResponse.idUsuario,
        nombre: authResponse.nombre,
        apellidos: datos.apellidos,
        gmail: datos.gmail,
        telefono: datos.telefono,
        rol: { 
          nombre: authResponse.rol,
          idRol: datos.idRol || 2 // Por defecto, rol usuario (asumimos que 2 es usuario normal)
        }
      };

      usuarioActual.value = usuario;
      token.value = authResponse.token;
      estaAutenticado.value = true;
      errorMessage.value = "";

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(usuario));
      localStorage.setItem("token", authResponse.token);
      
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al registrarse";
      return false;
    }
  }

  // Cerrar sesión
  function logout() {
    usuarioActual.value = null;
    token.value = null;
    estaAutenticado.value = false;
    errorMessage.value = "";
    
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    console.log("Sesión cerrada");
  }

  return {
    usuarioActual,
    token,
    estaAutenticado,
    errorMessage,
    cargarUsuarioDesdeStorage,
    login,
    registro,
    logout
  };
});