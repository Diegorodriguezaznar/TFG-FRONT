import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";

export const useUsuarioStore = defineStore("usuario", () => {
  const usuarios = ref<UsuarioDTO[]>([]);
  const usuario = ref<UsuarioDTO | null>(null);
  const errorMessage = ref<string>("");

  async function fetchAllUsuarios() {
    try {
      const response = await fetch("http://localhost:5190/api/Usuario");
      if (!response.ok) throw new Error("Error al obtener los usuarios");

      usuarios.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener los usuarios:", error);
    }
  }

  async function fetchUsuarioById(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener el usuario");

      usuario.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el usuario:", error);
    }
  }

  async function createUsuario(newUser: UsuarioDTO) {
    try {
      console.log("Usuario que se va a enviar:", newUser);

      const response = await fetch("http://localhost:5190/api/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        // Código para manejar errores (mantén el que ya tienes)
        // ...
      }

      // Verificar si hay contenido para procesar
      const contentType = response.headers.get("content-type");
      
      // Si no hay contenido o si no es JSON, simplemente devolvemos true para indicar éxito
      if (!contentType || !contentType.includes("application/json") || response.status === 204) {
        console.log("Operación exitosa, sin respuesta JSON");
        return true;
      }
      
      // Verificar si hay respuesta antes de intentar procesarla
      const text = await response.text();
      if (!text || text.trim() === "") {
        console.log("Respuesta vacía, pero operación exitosa");
        return true;
      }
      
      // Si hay contenido JSON, procesarlo
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn("No se pudo procesar la respuesta como JSON:", text);
        return true; 
      }
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  }

 async function updateUsuario(updatedUser: UsuarioDTO) {
  try {
    console.log("Usuario que se va a actualizar:", updatedUser);

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
        // Si no es un JSON válido, intentar obtener el texto
        try {
          const errorText = await response.text();
          console.error("Respuesta del servidor (texto):", errorText);
          
          if (response.status === 500) {
            mensajeError = "Error en el servidor. Por favor, contacta al administrador.";
          }
        } catch (textError) {
          console.error("No se pudo obtener texto del error:", textError);
        }
      }
      
      throw new Error(mensajeError);
    }
    
    // Verificar si hay contenido para procesar
    const contentType = response.headers.get("content-type");
    
    // Si no hay contenido o si no es JSON, simplemente devolvemos true
    if (!contentType || !contentType.includes("application/json") || response.status === 204) {
      console.log("Actualización exitosa, sin respuesta JSON");
      return updatedUser; 
    }
    
    // Verificar si hay respuesta antes de intentar procesarla
    const text = await response.text();
    if (!text || text.trim() === "") {
      console.log("Respuesta vacía, pero operación exitosa");
      return updatedUser; 
    }
    
    // Si hay contenido JSON, procesarlo
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn("No se pudo procesar la respuesta como JSON:", text);
      return updatedUser; 
    }
  } catch (error: any) {
    errorMessage.value = error.message;
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
}

  async function deleteUsuario(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Usuario/${idUsuario}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      usuarios.value = usuarios.value.filter(u => u.idUsuario !== idUsuario);
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  }

  return {
    usuarios,
    usuario,
    fetchAllUsuarios,
    fetchUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    errorMessage
  };
});