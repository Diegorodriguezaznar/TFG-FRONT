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
      const response = await fetch(`http://localhost:5190/api/pregunta/quiz/${idQuiz}`);
      if (!response.ok) throw new Error("Error al obtener las preguntas");

      const data = await response.json();
      preguntas.value = data.sort((a: PreguntaDTO, b: PreguntaDTO) => a.orden - b.orden);
      return preguntas.value;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener preguntas:", error);
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Crear pregunta
  async function createPregunta(pregunta: Omit<PreguntaDTO, 'idPregunta'>): Promise<PreguntaDTO | null> {
    try {
      const response = await fetch("http://localhost:5190/api/pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pregunta)
      });

      if (!response.ok) throw new Error("Error al crear la pregunta");
      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear pregunta:", error);
      return null;
    }
  }

  return {
    preguntas,
    errorMessage,
    loading,
    fetchPreguntasByQuizId,
    createPregunta
  };
});