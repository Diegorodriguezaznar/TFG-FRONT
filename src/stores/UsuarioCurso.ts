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
      
      // Probar diferentes formatos de envío
      try {
        // Formato 1: Enviar directamente
        const response = await fetch("http://localhost:5190/api/UsuarioCurso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaInscripcion)
        });
        
        if (response.ok) {
          console.log("Inscripción creada con éxito (formato 1)");
          await fetchAllInscripciones();
          return true;
        }
        
        const errorText = await response.text();
        console.log("Error formato 1:", errorText);
        
        // Formato 2: Usar otra estructura
        const datosAlternativos = {
          IdUsuario: nuevaInscripcion.idUsuario,
          IdCurso: nuevaInscripcion.idCurso
        };
        
        const response2 = await fetch("http://localhost:5190/api/UsuarioCurso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosAlternativos)
        });
        
        if (response2.ok) {
          console.log("Inscripción creada con éxito (formato 2)");
          await fetchAllInscripciones();
          return true;
        }
        
        const errorText2 = await response2.text();
        console.log("Error formato 2:", errorText2);
        
        // Formato 3: Usar estructura UsuarioCurso
        const datosConWrapper = {
          UsuarioCurso: {
            IdUsuario: nuevaInscripcion.idUsuario,
            IdCurso: nuevaInscripcion.idCurso
          }
        };
        
        const response3 = await fetch("http://localhost:5190http://localhost:5190/api/UsuarioCurso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosConWrapper)
        });
        
        if (response3.ok) {
          console.log("Inscripción creada con éxito (formato 3)");
          await fetchAllInscripciones();
          return true;
        }
        
        throw new Error("Ningún formato funcionó para crear la inscripción");
      } catch (formatError) {
        console.error("Error probando formatos:", formatError);
        throw formatError;
      }
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear la inscripción:", error);
      return false;
    }
  }

  // Eliminar una inscripción
  async function deleteInscripcion(idUsuario: number, idCurso: number) {
    try {
      // Intentar varios formatos para el DELETE
      try {
        // Formato 1: Con query parameters
        const urlDelete = `http://localhost:5190/api/UsuarioCurso?idUsuario=${idUsuario}&idCurso=${idCurso}`;
        console.log("Intentando eliminar con URL:", urlDelete);
        
        const response = await fetch(urlDelete, {
          method: "DELETE"
        });
        
        if (response.ok) {
          console.log("Inscripción eliminada con éxito (formato 1)");
          // Actualizar lista
          inscripciones.value = inscripciones.value.filter(
            i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
          );
          return true;
        }
        
        // Formato 2: Con cuerpo JSON
        console.log("Intentando formato 2 para eliminar");
        const response2 = await fetch("http://localhost:5190http://localhost:5190/api/UsuarioCurso", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUsuario, idCurso })
        });
        
        if (response2.ok) {
          console.log("Inscripción eliminada con éxito (formato 2)");
          // Actualizar lista
          inscripciones.value = inscripciones.value.filter(
            i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
          );
          return true;
        }
        
        // Formato 3: Con IdUsuario/IdCurso
        console.log("Intentando formato 3 para eliminar");
        const response3 = await fetch("http://localhost:5190http://localhost:5190/api/UsuarioCurso", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ IdUsuario: idUsuario, IdCurso: idCurso })
        });
        
        if (response3.ok) {
          console.log("Inscripción eliminada con éxito (formato 3)");
          // Actualizar lista
          inscripciones.value = inscripciones.value.filter(
            i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
          );
          return true;
        }
        
        throw new Error("Ningún formato funcionó para eliminar la inscripción");
      } catch (formatError) {
        console.error("Error probando formatos para DELETE:", formatError);
        throw formatError;
      }
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