import { defineStore } from "pinia";
import { ref } from "vue";
import type { PreguntaDTO } from "@/stores/dtos/PreguntaDTO";

export const usePreguntaStore = defineStore("pregunta", () => {
  const preguntas = ref<PreguntaDTO[]>([]);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // GET - Obtener preguntas por quiz
  async function fetchPreguntasByQuizId(idQuiz: number): Promise<PreguntaDTO[]> {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`https://academiqapi.retocsv.es/api/pregunta/quiz/${idQuiz}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        response = await fetch(`https://academiqapi.retocsv.es/api/Pregunta/quiz/${idQuiz}`, {
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
        throw new Error(`Error al obtener las preguntas: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      preguntas.value = data.sort((a: PreguntaDTO, b: PreguntaDTO) => a.orden - b.orden);
      return preguntas.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener las preguntas";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // POST - Crear pregunta
  async function createPregunta(pregunta: Omit<PreguntaDTO, 'idPregunta'>): Promise<PreguntaDTO | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      if (!pregunta.descripcion?.trim()) {
        throw new Error('La descripción de la pregunta es obligatoria');
      }

      if (!pregunta.idQuiz || pregunta.idQuiz <= 0) {
        throw new Error('ID de quiz inválido');
      }

      if (!pregunta.orden || pregunta.orden <= 0) {
        throw new Error('El orden de la pregunta debe ser mayor a 0');
      }

      const preguntaData = {
        descripcion: pregunta.descripcion.trim(),
        orden: Number(pregunta.orden),
        idQuiz: Number(pregunta.idQuiz)
      };

      let response;
      try {
        response = await fetch("https://academiqapi.retocsv.es/api/pregunta", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(preguntaData),
          signal: controller.signal
        });
      } catch (error) {
        response = await fetch("https://academiqapi.retocsv.es/api/Pregunta", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(preguntaData),
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
          // Error silencioso al parsear
        }
        
        throw new Error(`Error al crear la pregunta: ${errorMessage}`);
      }

      const result = await response.json();
      return result;

    } catch (error: any) {
      errorMessage.value = error.message || "Error al crear la pregunta";
      return null;
    }
  }

  // PUT - Actualizar pregunta
  async function updatePregunta(idPregunta: number, pregunta: Partial<PreguntaDTO>): Promise<PreguntaDTO | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`https://academiqapi.retocsv.es/api/pregunta/${idPregunta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(pregunta),
          signal: controller.signal
        });
      } catch (error) {
        response = await fetch(`https://academiqapi.retocsv.es/api/Pregunta/${idPregunta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(pregunta),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar la pregunta: ${response.status} ${response.statusText}. ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message || "Error al actualizar la pregunta";
      return null;
    }
  }

  // DELETE - Eliminar pregunta
  async function deletePregunta(idPregunta: number): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`https://academiqapi.retocsv.es/api/pregunta/${idPregunta}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
      } catch (error) {
        response = await fetch(`https://academiqapi.retocsv.es/api/Pregunta/${idPregunta}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar la pregunta: ${response.status} ${response.statusText}. ${errorText}`);
      }

      preguntas.value = preguntas.value.filter(p => p.idPregunta !== idPregunta);
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al eliminar la pregunta";
      return false;
    }
  }

  return {
    preguntas,
    errorMessage,
    loading,
    fetchPreguntasByQuizId,
    createPregunta,
    updatePregunta,
    deletePregunta
  };
});