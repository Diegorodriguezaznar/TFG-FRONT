import { defineStore } from "pinia";
import { ref } from "vue";
import type { RespuestaDTO } from "@/stores/dtos/RespuestaDTO";
import type { PreguntaDTO } from "@/stores/dtos/PreguntaDTO";

export const useRespuestaStore = defineStore("respuesta", () => {
  // Estado
  const respuestas = ref<RespuestaDTO[]>([]);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // GET - Obtener respuestas por pregunta
  async function fetchRespuestasByPreguntaId(idPregunta: number): Promise<RespuestaDTO[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://34.198.50.70:5000/api/respuesta/pregunta/${idPregunta}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        response = await fetch(`http://34.198.50.70:5000/api/Respuesta/pregunta/${idPregunta}`, {
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
      const message = error.name === 'AbortError'
        ? "La conexión con el servidor ha excedido el tiempo de espera"
        : error instanceof TypeError && error.message.includes('Failed to fetch')
        ? "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución."
        : error.message || "Error al obtener las respuestas";
      
      errorMessage.value = message;
      return [];
    }
  }

  // GET - Obtener respuestas para múltiples preguntas
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
      return respuestasMap;
    } finally {
      loading.value = false;
    }
  }

  // POST - Crear respuesta
  async function createRespuesta(respuesta: Omit<RespuestaDTO, 'idRespuesta'>): Promise<RespuestaDTO | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Validaciones
      if (!respuesta.texto?.trim()) {
        throw new Error('El texto de la respuesta es obligatorio');
      }

      if (!respuesta.idPregunta || respuesta.idPregunta <= 0) {
        throw new Error('ID de pregunta inválido');
      }

      if (!respuesta.orden || respuesta.orden <= 0) {
        throw new Error('El orden de la respuesta debe ser mayor a 0');
      }

      const respuestaData = {
        texto: respuesta.texto.trim(),
        esCorrecta: Boolean(respuesta.esCorrecta),
        orden: Number(respuesta.orden),
        idPregunta: Number(respuesta.idPregunta)
      };

      let response;
      try {
        response = await fetch("http://34.198.50.70:5000/api/respuesta", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(respuestaData),
          signal: controller.signal
        });
      } catch (error) {
        response = await fetch("http://34.198.50.70:5000/api/Respuesta", {
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
          // Error al parsear respuesta
        }
        
        throw new Error(`Error al crear la respuesta: ${errorMessage}`);
      }

      return await response.json();

    } catch (error: any) {
      const message = error.name === 'AbortError'
        ? "La conexión con el servidor ha excedido el tiempo de espera"
        : error instanceof TypeError && error.message.includes('Failed to fetch')
        ? "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución."
        : error.message || "Error al crear la respuesta";
      
      errorMessage.value = message;
      return null;
    }
  }

  // PUT - Actualizar respuesta
  async function updateRespuesta(idRespuesta: number, respuesta: Partial<RespuestaDTO>): Promise<RespuestaDTO | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://34.198.50.70:5000/api/respuesta/${idRespuesta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(respuesta),
          signal: controller.signal
        });
      } catch (error) {
        response = await fetch(`http://34.198.50.70:5000/api/Respuesta/${idRespuesta}`, {
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
      return null;
    }
  }

  // DELETE - Eliminar respuesta
  async function deleteRespuesta(idRespuesta: number): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://34.198.50.70:5000/api/respuesta/${idRespuesta}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
      } catch (error) {
        response = await fetch(`http://34.198.50.70:5000/api/Respuesta/${idRespuesta}`, {
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