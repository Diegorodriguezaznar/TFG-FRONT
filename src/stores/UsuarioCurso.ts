import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioCursoDTO } from "@/stores/dtos/UsuarioCursoDTO";

export const useUsuarioCursoStore = defineStore("usuarioCurso", () => {
  const inscripciones = ref<UsuarioCursoDTO[]>([]);
  const errorMessage = ref<string>("");

  // Obtener todas las inscripciones
  async function fetchAllInscripciones() {
    try {
      const response = await fetch("http://localhost:5190/api/UsuarioCurso");
      if (!response.ok) throw new Error("Error al obtener las inscripciones");

      inscripciones.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener las inscripciones:", error);
    }
  }

  // Obtener inscripciones por ID de usuario
  async function fetchInscripcionesByUsuarioId(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/UsuarioCurso/usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener las inscripciones del usuario");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener las inscripciones del usuario:", error);
      return [];
    }
  }

  // Obtener inscripciones por ID de curso
  async function fetchInscripcionesByCursoId(idCurso: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/UsuarioCurso/curso/${idCurso}`);
      if (!response.ok) throw new Error("Error al obtener las inscripciones del curso");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener las inscripciones del curso:", error);
      return [];
    }
  }

  // Crear una nueva inscripción
  async function createInscripcion(nuevaInscripcion: UsuarioCursoDTO) {
    try {
      console.log("Enviando POST a http://localhost:5190/api/UsuarioCurso:", nuevaInscripcion);
      
      // Intentar con formato directo primero
      const response = await fetch("http://localhost:5190/api/UsuarioCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaInscripcion)
      });
      
      if (response.ok) {
        console.log("Inscripción creada con éxito");
        await fetchAllInscripciones();
        return true;
      }
      
      // Si falla, loguear el error para diagnóstico
      const errorText = await response.text();
      console.error("Error al crear inscripción:", errorText);
      errorMessage.value = `Error al crear inscripción: ${errorText}`;
      return false;
      
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear la inscripción:", error);
      return false;
    }
  }

  async function deleteInscripcion(idUsuario: number, idCurso: number) {
    try {
      // Formato 1: Con query parameters (este es el formato que parece funcionar según el componente original)
      const urlDelete = `http://localhost:5190/api/UsuarioCurso?idUsuario=${idUsuario}&idCurso=${idCurso}`;
      console.log("Intentando eliminar con URL:", urlDelete);
      
      const response = await fetch(urlDelete, {
        method: "DELETE"
      });
      
      if (response.ok) {
        console.log("Inscripción eliminada con éxito");
        // Actualizar lista
        inscripciones.value = inscripciones.value.filter(
          i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
        );
        return true;
      }
      
      // Si falla, loguear el error para diagnóstico
      const errorText = await response.text();
      console.error("Error al eliminar inscripción:", errorText);
      errorMessage.value = `Error al eliminar inscripción: ${errorText}`;
      return false;
      
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar la inscripción:", error);
      return false;
    }
  }

  return {
    inscripciones,
    fetchAllInscripciones,
    fetchInscripcionesByUsuarioId,
    fetchInscripcionesByCursoId,
    createInscripcion,
    deleteInscripcion,
    errorMessage
  };
});