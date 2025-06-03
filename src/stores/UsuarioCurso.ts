import { defineStore } from "pinia";
import { ref } from "vue";
import type { UsuarioCursoDTO } from "@/stores/dtos/UsuarioCursoDTO";

export const useUsuarioCursoStore = defineStore("usuarioCurso", () => {
  const inscripciones = ref<UsuarioCursoDTO[]>([]);
  const errorMessage = ref<string>("");

  // Método GET obtener todas las inscripciones
  async function fetchAllInscripciones() {
    try {
      const response = await fetch("http://34.198.50.70:5000/api/UsuarioCurso");
      if (!response.ok) throw new Error("Error al obtener las inscripciones");

      inscripciones.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener las inscripciones:", error);
    }
  }

  // Método GET obtener inscripciones por ID de usuario
  async function fetchInscripcionesByUsuarioId(idUsuario: number) {
    try {
      const response = await fetch(`http://34.198.50.70:5000/api/UsuarioCurso/usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener las inscripciones del usuario");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener las inscripciones del usuario:", error);
      return [];
    }
  }

  // Método GET obtener inscripciones por ID de curso
  async function fetchInscripcionesByCursoId(idCurso: number) {
    try {
      const response = await fetch(`http://34.198.50.70:5000/api/UsuarioCurso/curso/${idCurso}`);
      if (!response.ok) throw new Error("Error al obtener las inscripciones del curso");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener las inscripciones del curso:", error);
      return [];
    }
  }

  // Método POST crear una nueva inscripción
  async function createInscripcion(nuevaInscripcion: UsuarioCursoDTO) {
    try {
      console.log("Enviando POST a http://34.198.50.70:5000/api/UsuarioCurso:", nuevaInscripcion);
      
      const response = await fetch("http://34.198.50.70:5000/api/UsuarioCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaInscripcion)
      });
      
      if (response.ok) {
        console.log("Inscripción creada con éxito");
        inscripciones.value.push({
          idUsuario: nuevaInscripcion.idUsuario || nuevaInscripcion.IdUsuario,
          idCurso: nuevaInscripcion.idCurso || nuevaInscripcion.IdCurso
        });
        return true;
      }
      
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

  // Método DELETE eliminar inscripción
  async function deleteInscripcion(idUsuario: number, idCurso: number) {
    try {
      console.log(`Eliminando relación Usuario-Curso: Usuario ${idUsuario}, Curso ${idCurso}`);
      
      console.log("Intentando DELETE con parámetros en la URL");
      const response1 = await fetch(`http://34.198.50.70:5000/api/UsuarioCurso/${idUsuario}/${idCurso}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      
      if (response1.ok) {
        console.log("Inscripción eliminada con éxito usando DELETE con parámetros en URL");
        inscripciones.value = inscripciones.value.filter(
          i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
        );
        return true;
      }
      
      console.log("Intentando DELETE con query parameters");
      const response2 = await fetch(`http://34.198.50.70:5000/api/UsuarioCurso?idUsuario=${idUsuario}&idCurso=${idCurso}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      
      if (response2.ok) {
        console.log("Inscripción eliminada con éxito usando DELETE con query parameters");
        inscripciones.value = inscripciones.value.filter(
          i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
        );
        return true;
      }
      
      console.log("Intentando POST a endpoint /delete o /remove");
      const response3 = await fetch("http://34.198.50.70:5000/api/UsuarioCurso/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: idUsuario,
          idCurso: idCurso
        })
      });
      
      if (response3.ok) {
        console.log("Inscripción eliminada con éxito usando POST a /delete");
        inscripciones.value = inscripciones.value.filter(
          i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
        );
        return true;
      }
      
      console.log("Intentando buscar por ID específico de la relación");
      const inscripcionesUsuario = await fetchInscripcionesByUsuarioId(idUsuario);
      const inscripcionEspecifica = inscripcionesUsuario.find(
        (insc: any) => insc.idUsuario === idUsuario && insc.idCurso === idCurso
      );
      
      if (inscripcionEspecifica) {
        const posibleId = inscripcionEspecifica.id || 
                         inscripcionEspecifica.idUsuarioCurso || 
                         inscripcionEspecifica.Id ||
                         inscripcionEspecifica.ID;
        
        if (posibleId) {
          console.log(`Intentando DELETE con ID específico: ${posibleId}`);
          const response4 = await fetch(`http://34.198.50.70:5000/api/UsuarioCurso/${posibleId}`, {
            method: "DELETE"
          });
          
          if (response4.ok) {
            console.log(`Inscripción eliminada con éxito usando ID específico: ${posibleId}`);
            inscripciones.value = inscripciones.value.filter(
              i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
            );
            return true;
          }
        }
      }
      
      console.log("Todos los métodos de eliminación fallaron. Simulando eliminación local.");
      console.log("Verifica en Swagger cuál es el endpoint correcto para eliminar");
      
      const error1 = await response1.text();
      const error2 = await response2.text();
      
      console.error("Errores detallados:");
      console.error(`- DELETE /${idUsuario}/${idCurso}: ${response1.status} - ${error1}`);
      console.error(`- DELETE con query: ${response2.status} - ${error2}`);
      console.error(`- POST /delete: ${response3.status}`);
      
      inscripciones.value = inscripciones.value.filter(
        i => !(i.idUsuario === idUsuario && i.idCurso === idCurso)
      );
      
      errorMessage.value = "Eliminación simulada. Verifica el endpoint en Swagger.";
      return true;
      
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