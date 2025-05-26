import { defineStore } from "pinia";
import { ref } from "vue";
import type { RespuestaDTO } from "@/stores/dtos/RespuestaDTO";
import type { PreguntaDTO } from "@/stores/dtos/PreguntaDTO";

export const useRespuestaStore = defineStore("respuesta", () => {
  // --------------------------- Estado ---------------------------
  const respuestas = ref<RespuestaDTO[]>([]);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos ---------------------------

  // Obtener respuestas por pregunta
  async function fetchRespuestasByPreguntaId(idPregunta: number): Promise<RespuestaDTO[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://localhost:5190/api/respuesta/pregunta/${idPregunta}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        // Fallback
        response = await fetch(`http://localhost:5190/api/Respuesta/pregunta/${idPregunta}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener las respuestas: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      return data.sort((a: RespuestaDTO, b: RespuestaDTO) => a.orden - b.orden);
    } catch (error: any) {
      let message = "Error al obtener las respuestas";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return [];
    }
  }

  // Obtener respuestas para múltiples preguntas
  async function fetchRespuestasForQuiz(preguntas: PreguntaDTO[]): Promise<Map<number, RespuestaDTO[]>> {
    loading.value = true;
    const respuestasMap = new Map<number, RespuestaDTO[]>();
    
    try {
      const promesas = preguntas.map(async (pregunta) => {
        const respuestas = await fetchRespuestasByPreguntaId(pregunta.idPregunta);
        respuestasMap.set(pregunta.idPregunta, respuestas);
      });
      
      await Promise.all(promesas);
      return respuestasMap;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener respuestas del quiz:", error);
      return respuestasMap;
    } finally {
      loading.value = false;
    }
  }

  // Crear respuesta - ARREGLADO con mejor manejo de errores
  async function createRespuesta(respuesta: Omit<RespuestaDTO, 'idRespuesta'>): Promise<RespuestaDTO | null> {
    try {
      console.log('Creando respuesta:', respuesta);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Validar datos antes de enviar
      if (!respuesta.texto?.trim()) {
        throw new Error('El texto de la respuesta es obligatorio');
      }

      if (!respuesta.idPregunta || respuesta.idPregunta <= 0) {
        throw new Error('ID de pregunta inválido');
      }

      if (!respuesta.orden || respuesta.orden <= 0) {
        throw new Error('El orden de la respuesta debe ser mayor a 0');
      }

      // Preparar datos para envío
      const respuestaData = {
        texto: respuesta.texto.trim(),
        esCorrecta: Boolean(respuesta.esCorrecta),
        orden: Number(respuesta.orden),
        idPregunta: Number(respuesta.idPregunta)
      };

      console.log('Datos de respuesta a enviar:', respuestaData);

      let response;
      try {
        // Intentar con el endpoint principal
        response = await fetch("http://localhost:5190/api/respuesta", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(respuestaData),
          signal: controller.signal
        });
      } catch (error) {
        // Fallback - probar endpoint alternativo
        response = await fetch("http://localhost:5190/api/Respuesta", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(respuestaData),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
          } else {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.warn("No se pudo parsear el error del servidor");
        }
        
        console.error("Error del servidor al crear respuesta:", errorMessage);
        throw new Error(`Error al crear la respuesta: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Respuesta creada exitosamente:', result);
      return result;

    } catch (error: any) {
      let message = "Error al crear la respuesta";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return null;
    }
  }

  // Actualizar respuesta
  async function updateRespuesta(idRespuesta: number, respuesta: Partial<RespuestaDTO>): Promise<RespuestaDTO | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://localhost:5190/api/respuesta/${idRespuesta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(respuesta),
          signal: controller.signal
        });
      } catch (error) {
        // Fallback
        response = await fetch(`http://localhost:5190/api/Respuesta/${idRespuesta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(respuesta),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar la respuesta: ${response.status} ${response.statusText}. ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al actualizar respuesta:", error);
      return null;
    }
  }

  // Eliminar respuesta
  async function deleteRespuesta(idRespuesta: number): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://localhost:5190/api/respuesta/${idRespuesta}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
      } catch (error) {
        // Fallback
        response = await fetch(`http://localhost:5190/api/Respuesta/${idRespuesta}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar la respuesta: ${response.status} ${response.statusText}. ${errorText}`);
      }

      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar respuesta:", error);
      return false;
    }
  }

  return {
    respuestas,
    errorMessage,
    loading,
    fetchRespuestasByPreguntaId,
    fetchRespuestasForQuiz,
    createRespuesta,
    updateRespuesta,
    deleteRespuesta
  };
});