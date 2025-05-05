import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";

export const useUsuarioStore = defineStore("usuario", () => {
  // --------------------------- Estado ---------------------------
  const usuarios = ref<UsuarioDTO[]>([]);
  const usuario = ref<UsuarioDTO | null>(null);
  const errorMessage = ref<string>("");

  // --------------------------- Métodos de Fetch ---------------------------
  
  // Obtener todos los usuarios
  async function fetchAllUsuarios() {
    try {
      const response = await fetch("http://localhost:5687/api/Usuario");
      if (!response.ok) throw new Error("Error al obtener los usuarios");

      usuarios.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener los usuarios:", error);
    }
  }

  // Obtener un usuario por ID
  async function fetchUsuarioById(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener el usuario");

      usuario.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el usuario:", error);
    }
  }

  // --------------------------- Métodos de Modificación ---------------------------
  
  // Crear un nuevo usuario
  async function createUsuario(newUser: UsuarioDTO) {
    try {
      const response = await fetch("http://localhost:5687/api/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Error al registrar el usuario");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al registrar el usuario:", error);
      return null;
    }
  }

  // Actualizar un usuario existente
  async function updateUsuario(updatedUser: UsuarioDTO) {
    try {
      const response = await fetch(`http://localhost:5687/api/Usuario/${updatedUser.idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Error al actualizar el usuario");

      usuario.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al actualizar el usuario:", error);
    }
  }

  // Eliminar un usuario
  async function deleteUsuario(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Usuario/${idUsuario}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      // Actualizar la lista de usuarios en el frontend después de eliminar
      usuarios.value = usuarios.value.filter(u => u.idUsuario !== idUsuario);
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar el usuario:", error);
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
