import { defineStore } from "pinia";
import { ref } from "vue";
import type { QuizDTO } from "@/stores/dtos/QuizDTO";
import type { QuizCompletaDTO } from "@/stores/dtos/QuizCompletaDTO";
import { useUsuarioStore } from "@/stores/Usuario";

export const useQuizStore = defineStore("quiz", () => {
  // --------------------------- Estado ---------------------------
  const quizzes = ref<QuizCompletaDTO[]>([]);
  const quizCompleto = ref<QuizCompletaDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos de Fetch ---------------------------

  // Obtener todos los quizzes con información completa
  async function fetchAllQuizzes(): Promise<QuizCompletaDTO[]> {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:5190/api/quiz");
      if (!response.ok) throw new Error("Error al obtener todos los quizzes");

      const quizzesData = await response.json();
      
      // Enriquecer los datos con información de usuario
      const usuarioStore = useUsuarioStore();
      await usuarioStore.fetchAllUsuarios();
      
      quizzes.value = quizzesData.map((quiz: QuizDTO) => {
        const usuario = usuarioStore.usuarios.find(u => u.idUsuario === quiz.idUsuario);
        
        return {
          idQuiz: quiz.idQuiz,
          nombre: quiz.nombre,
          descripcion: quiz.descripcion,
          nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Usuario desconocido',
          fechaCreacion: new Date().toLocaleDateString(), // Se podría agregar fecha al DTO
          totalPreguntas: 0, // Se calculará dinámicamente
          idAsignatura: quiz.idAsignatura,
          idUsuario: quiz.idUsuario
        };
      });

      return quizzes.value;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener todos los quizzes:", error);
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Obtener quiz por ID
  async function fetchQuizById(idQuiz: number): Promise<QuizDTO | null> {
    try {
      const response = await fetch(`http://localhost:5190/api/quiz/${idQuiz}`);
      if (!response.ok) throw new Error("Error al obtener el quiz");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el quiz:", error);
      return null;
    }
  }

  // Obtener quiz completo por ID (con información de usuario)
  async function fetchQuizCompletoById(idQuiz: number): Promise<QuizCompletaDTO | null> {
    try {
      const quizData = await fetchQuizById(idQuiz);
      if (!quizData) return null;

      const usuarioStore = useUsuarioStore();
      const usuario = await usuarioStore.fetchUsuarioById(quizData.idUsuario);
      
      quizCompleto.value = {
        idQuiz: quizData.idQuiz,
        nombre: quizData.nombre,
        descripcion: quizData.descripcion,
        nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Usuario desconocido',
        fechaCreacion: new Date().toLocaleDateString(),
        totalPreguntas: 0, // Se calculará con las preguntas
        idAsignatura: quizData.idAsignatura,
        idUsuario: quizData.idUsuario
      };

      return quizCompleto.value;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener quiz completo:", error);
      return null;
    }
  }

  // Obtener quizzes por ID de usuario
  async function fetchQuizzesByUsuario(idUsuario: number): Promise<QuizCompletaDTO[]> {
    try {
      const response = await fetch(`http://localhost:5190/api/quiz/usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener los quizzes del usuario");

      const quizzesData = await response.json();
      
      const usuarioStore = useUsuarioStore();
      const usuario = await usuarioStore.fetchUsuarioById(idUsuario);
      const nombreUsuario = usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Usuario desconocido';

      return quizzesData.map((quiz: QuizDTO) => ({
        idQuiz: quiz.idQuiz,
        nombre: quiz.nombre,
        descripcion: quiz.descripcion,
        nombreUsuario,
        fechaCreacion: new Date().toLocaleDateString(),
        totalPreguntas: 0,
        idAsignatura: quiz.idAsignatura,
        idUsuario: quiz.idUsuario
      }));
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener quizzes por usuario:", error);
      return [];
    }
  }

  // Crear nuevo quiz
  async function createQuiz(quiz: Omit<QuizDTO, 'idQuiz'>): Promise<QuizDTO | null> {
    try {
      const response = await fetch("http://localhost:5190/api/quiz", {
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
      
      // Actualizar la lista local
      await fetchAllQuizzes();
      
      return createdQuiz;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear el quiz:", error);
      return null;
    }
  }

  // Actualizar quiz
  async function updateQuiz(idQuiz: number, updatedData: Partial<QuizDTO>): Promise<QuizDTO | null> {
    try {
      const response = await fetch(`http://localhost:5190/api/quiz/${idQuiz}`, {
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
      
      // Actualizar la lista local
      await fetchAllQuizzes();
      
      return updatedQuiz;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al actualizar el quiz:", error);
      return null;
    }
  }

  // Eliminar quiz
  async function deleteQuiz(idQuiz: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:5190/api/quiz/${idQuiz}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el quiz");

      // Actualizar la lista local
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
    quizCompleto,
    errorMessage,
    loading,
    fetchAllQuizzes,
    fetchQuizById,
    fetchQuizCompletoById,
    fetchQuizzesByUsuario,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
});