// src/stores/quizStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { QuizDTO } from "@/stores/dtos/QuizDTO";

export const useQuizStore = defineStore("quiz", () => {
  // --------------------------- Estado ---------------------------
  const quizzes = ref<QuizDTO[]>([]);
  const errorMessage = ref<string>("");

  // --------------------------- Métodos de Fetch ---------------------------

  // Obtener todos los quizzes
  async function fetchAllQuizzes() {
    try {
      const response = await fetch("http://localhost:5190/api/Quiz");
      if (!response.ok) throw new Error("Error al obtener todos los quizzes");

      quizzes.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener todos los quizzes:", error);
    }
  }

  // Obtener quiz por ID
  async function fetchQuizById(idQuiz: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Quiz/${idQuiz}`);
      if (!response.ok) throw new Error("Error al obtener el quiz");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el quiz:", error);
      return null;
    }
  }

  // Obtener quizzes por ID de usuario
  async function fetchQuizzesByUsuario(idUsuario: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Quiz/usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener los quizzes del usuario");

      quizzes.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener quizzes por usuario:", error);
    }
  }

  // Crear nuevo quiz
  async function createQuiz(quiz: Partial<QuizDTO>) {
    try {
      const response = await fetch("http://localhost:5190/api/Quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(quiz)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el quiz");
      }

      const createdQuiz = await response.json();
      quizzes.value.push(createdQuiz);
      return createdQuiz;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear el quiz:", error);
      return null;
    }
  }

  // Actualizar quiz
  async function updateQuiz(idQuiz: number, updatedData: Partial<QuizDTO>) {
    try {
      const response = await fetch(`http://localhost:5190/api/Quiz/${idQuiz}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el quiz");
      }

      const updatedQuiz = await response.json();
      const index = quizzes.value.findIndex(q => q.idQuiz === idQuiz);
      if (index !== -1) quizzes.value[index] = updatedQuiz;

      return updatedQuiz;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al actualizar el quiz:", error);
      return null;
    }
  }

  // Eliminar quiz
  async function deleteQuiz(idQuiz: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Quiz/${idQuiz}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el quiz");

      quizzes.value = quizzes.value.filter(q => q.idQuiz !== idQuiz);
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar el quiz:", error);
      return false;
    }
  }

  return {
    quizzes,
    errorMessage,
    fetchAllQuizzes,
    fetchQuizById,
    fetchQuizzesByUsuario,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
});
