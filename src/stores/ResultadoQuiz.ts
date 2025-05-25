import { defineStore } from "pinia";
import { ref } from "vue";
import type { ResultadoQuizDTO, RespuestaUsuarioDTO } from "@/stores/dtos/ResultadoQuizDTO";

export const useResultadoQuizStore = defineStore("resultadoQuiz", () => {
  // --------------------------- Estado ---------------------------
  const resultadoActual = ref<ResultadoQuizDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos ---------------------------

  // Guardar resultado del quiz
  async function saveResultadoQuiz(resultado: Omit<ResultadoQuizDTO, 'idResultado'>): Promise<boolean> {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:5190/api/resultadoquiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultado)
      });

      if (!response.ok) throw new Error("Error al guardar el resultado");
      
      const data = await response.json();
      resultadoActual.value = data;
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al guardar resultado:", error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Calcular puntuación
  function calcularPuntuacion(respuestasUsuario: RespuestaUsuarioDTO[]): number {
    const correctas = respuestasUsuario.filter(r => r.esCorrecta).length;
    return Math.round((correctas / respuestasUsuario.length) * 100);
  }

  // Limpiar resultado actual
  function clearResultado() {
    resultadoActual.value = null;
    errorMessage.value = "";
  }

  return {
    resultadoActual,
    errorMessage,
    loading,
    saveResultadoQuiz,
    calcularPuntuacion,
    clearResultado
  };
});