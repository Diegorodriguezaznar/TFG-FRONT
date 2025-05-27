import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";

export const useUsuarioStore = defineStore("usuario", () => {
  // Estado
  const usuarios = ref<UsuarioDTO[]>([]);
  const usuario = ref<UsuarioDTO | null>(null);
  const errorMessage = ref<string>("");

  // GET - Obtener todos los usuarios
  async function fetchAllUsuarios() {
    try {
      const response = await fetch("http://localhost:5190/api/Usuario");
      if (!response.ok) throw new Error("Error al obtener los usuarios");

      usuarios.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
    }
  }

  // GET - Obtener usuario por ID
  async function fetchUsuarioById(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener el usuario");

      usuario.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
    }
  }

  // POST - Registrar usuario (registro público)
  async function registrarUsuario(newUser: UsuarioDTO) {
    try {
      const response = await fetch("http://localhost:5190/api/Auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el usuario");
      }

      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json") || response.status === 204) {
        return true;
      }
      
      const text = await response.text();
      if (!text || text.trim() === "") {
        return true;
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return true; 
      }
    } catch (error: any) {
      errorMessage.value = error.message;
      throw error;
    }
  }
  
  // POST - Crear usuario (zona privada)
  async function createUsuario(newUser: UsuarioDTO) {
    try {
      const response = await fetch("http://localhost:5190/api/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Error al crear el usuario");
      }

      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json") || response.status === 204) {
        return true;
      }
      
      const text = await response.text();
      if (!text || text.trim() === "") {
        return true;
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return true; 
      }
    } catch (error: any) {
      errorMessage.value = error.message;
      throw error;
    }
  }

  // PUT - Actualizar usuario
  async function updateUsuario(updatedUser: UsuarioDTO) {
    try {
      const response = await fetch(`http://localhost:5190/api/Usuario/${updatedUser.idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        let mensajeError = "Error al actualizar el usuario";
        
        try {
          const errorData = await response.json();
          if (errorData && errorData.errors) {
            const erroresDetallados = Object.entries(errorData.errors)
              .map(([campo, mensajes]) => `${campo}: ${Array.isArray(mensajes) ? mensajes.join(', ') : mensajes}`)
              .join('; ');
            
            if (erroresDetallados) {
              mensajeError = `Error de validación: ${erroresDetallados}`;
            }
          }
        } catch (e) {
          if (response.status === 500) {
            mensajeError = "Error en el servidor. Por favor, contacta al administrador.";
          }
        }
        
        throw new Error(mensajeError);
      }
      
      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json") || response.status === 204) {
        return updatedUser; 
      }
      
      const text = await response.text();
      if (!text || text.trim() === "") {
        return updatedUser; 
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return updatedUser; 
      }
    } catch (error: any) {
      errorMessage.value = error.message;
      throw error;
    }
  }

  // DELETE - Eliminar usuario
  async function deleteUsuario(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Usuario/${idUsuario}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      usuarios.value = usuarios.value.filter(u => u.idUsuario !== idUsuario);
    } catch (error: any) {
      errorMessage.value = error.message;
      throw error;
    }
  }

  // PUT - Aceptar usuario como profesor
  async function aceptarUsuarioComoProfesor(idUsuario: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:5190/api/Usuario/${idUsuario}/aceptar-profesor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el rol: ${errorText}`);
      }

      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al aceptar usuario como profesor";
      return false;
    }
  }

  return {
    usuarios,
    usuario,
    fetchAllUsuarios,
    fetchUsuarioById,
    registrarUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    aceptarUsuarioComoProfesor,
    errorMessage
  };
});