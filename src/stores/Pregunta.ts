import { defineStore } from "pinia";
import { ref } from "vue";
import type { PreguntaDTO } from "@/stores/dtos/PreguntaDTO";

export const usePreguntaStore = defineStore("pregunta", () => {
  // --------------------------- Estado ---------------------------
  const preguntas = ref<PreguntaDTO[]>([]);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos ---------------------------

  // Obtener preguntas por quiz
  async function fetchPreguntasByQuizId(idQuiz: number): Promise<PreguntaDTO[]> {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Probamos diferentes endpoints posibles
      let response;
      try {
        response = await fetch(`http://localhost:5190/api/pregunta/quiz/${idQuiz}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        // Fallback - probar endpoint alternativo
        response = await fetch(`http://localhost:5190/api/Pregunta/quiz/${idQuiz}`, {
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
      let message = "Error al obtener las preguntas";
      
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
    } finally {
      loading.value = false;
    }
  }

  // Crear pregunta - ARREGLADO con mejor manejo de errores
  async function createPregunta(pregunta: Omit<PreguntaDTO, 'idPregunta'>): Promise<PreguntaDTO | null> {
    try {
      console.log('Creando pregunta:', pregunta);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Mayor timeout para creación

      // Validar datos antes de enviar
      if (!pregunta.descripcion?.trim()) {
        throw new Error('La descripción de la pregunta es obligatoria');
      }

      if (!pregunta.idQuiz || pregunta.idQuiz <= 0) {
        throw new Error('ID de quiz inválido');
      }

      if (!pregunta.orden || pregunta.orden <= 0) {
        throw new Error('El orden de la pregunta debe ser mayor a 0');
      }

      // Preparar datos para envío
      const preguntaData = {
        descripcion: pregunta.descripcion.trim(),
        orden: Number(pregunta.orden),
        idQuiz: Number(pregunta.idQuiz)
      };

      console.log('Datos a enviar:', preguntaData);

      let response;
      try {
        // Intentar con el endpoint principal
        response = await fetch("http://localhost:5190/api/pregunta", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(preguntaData),
          signal: controller.signal
        });
      } catch (error) {
        // Fallback - probar endpoint alternativo
        response = await fetch("http://localhost:5190/api/Pregunta", {
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
          console.warn("No se pudo parsear el error del servidor");
        }
        
        console.error("Error del servidor:", errorMessage);
        throw new Error(`Error al crear la pregunta: ${errorMessage}`);
      }

      const result = await response.json();
      console.log('Pregunta creada exitosamente:', result);
      return result;

    } catch (error: any) {
      let message = "Error al crear la pregunta";
      
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

  // Actualizar pregunta
  async function updatePregunta(idPregunta: number, pregunta: Partial<PreguntaDTO>): Promise<PreguntaDTO | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://localhost:5190/api/pregunta/${idPregunta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(pregunta),
          signal: controller.signal
        });
      } catch (error) {
        // Fallback
        response = await fetch(`http://localhost:5190/api/Pregunta/${idPregunta}`, {
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
      errorMessage.value = error.message;
      console.error("Error al actualizar pregunta:", error);
      return null;
    }
  }

  // Eliminar pregunta
  async function deletePregunta(idPregunta: number): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let response;
      try {
        response = await fetch(`http://localhost:5190/api/pregunta/${idPregunta}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
      } catch (error) {
        // Fallback
        response = await fetch(`http://localhost:5190/api/Pregunta/${idPregunta}`, {
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

      // Actualizar lista local
      preguntas.value = preguntas.value.filter(p => p.idPregunta !== idPregunta);
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar pregunta:", error);
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