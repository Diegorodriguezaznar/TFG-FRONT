import { defineStore } from "pinia";
import { ref } from "vue";
import type { RespuestaDTO } from "@/stores/dtos/RespuestaDTO";

export const useRespuestaStore = defineStore("respuesta", () => {
  // --------------------------- Estado ---------------------------
  const respuestas = ref<RespuestaDTO[]>([]);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos ---------------------------

  // Obtener respuestas por pregunta
  async function fetchRespuestasByPreguntaId(idPregunta: number): Promise<RespuestaDTO[]> {
    try {
      const response = await fetch(`http://localhost:5190/api/respuesta/pregunta/${idPregunta}`);
      if (!response.ok) throw new Error("Error al obtener las respuestas");

      const data = await response.json();
      return data.sort((a: RespuestaDTO, b: RespuestaDTO) => a.orden - b.orden);
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener respuestas:", error);
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

  // Crear respuesta
  async function createRespuesta(respuesta: Omit<RespuestaDTO, 'idRespuesta'>): Promise<RespuestaDTO | null> {
    try {
      const response = await fetch("http://localhost:5190/api/respuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respuesta)
      });

      if (!response.ok) throw new Error("Error al crear la respuesta");
      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear respuesta:", error);
      return null;
    }
  }

  return {
    respuestas,
    errorMessage,
    loading,
    fetchRespuestasByPreguntaId,
    fetchRespuestasForQuiz,
    createRespuesta
  };
});