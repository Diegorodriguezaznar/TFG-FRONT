import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioDTO } from "@/stores/dtos/UsuarioDTO";

export const useUsuarioStore = defineStore("usuario", () => {
  const usuarios = ref<UsuarioDTO[]>([]);
  const usuario = ref<UsuarioDTO | null>(null);
  const errorMessage = ref<string>("");

  // la clasica find all
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

  //find by id 
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

  // creado de usuarios
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

  // putter como el palo de golf
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

  // borra
  async function deleteUsuario(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Usuario/${idUsuario}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el usuario");

      // borrado de front (actualiza la pagina para que se impriman los usuario existentes)
      usuarios.value = usuarios.value.filter(u => u.idUsuario !== idUsuario);
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar el usuario:", error);
    }
  }

  return { usuarios, usuario, fetchAllUsuarios, fetchUsuarioById, createUsuario, updateUsuario, deleteUsuario, errorMessage };
});