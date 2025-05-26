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

  // MÉTODO MEJORADO: Eliminar quiz con ID de usuario
  async function deleteQuiz(idQuiz: number, idUsuario?: number): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";
    
    try {
      console.log(`🗑️ Eliminando quiz ID: ${idQuiz}, Usuario ID: ${idUsuario}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Preparar body con ID de usuario si es necesario
      const requestBody = idUsuario ? { idUsuario } : undefined;
      
      let response;
      try {
        response = await fetch(`http://localhost:5190/api/quiz/${idQuiz}`, {
          method: "DELETE",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: requestBody ? JSON.stringify(requestBody) : undefined
        });
      } catch (error) {
        // Fallback con endpoint alternativo
        response = await fetch(`http://localhost:5190/api/Quiz/${idQuiz}`, {
          method: "DELETE",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: requestBody ? JSON.stringify(requestBody) : undefined
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
        
        throw new Error(`Error al eliminar el quiz: ${errorMessage}`);
      }

      console.log(`✅ Quiz ${idQuiz} eliminado exitosamente del servidor`);

      // Eliminar de la lista local
      quizzes.value = quizzes.value.filter(q => q.idQuiz !== idQuiz);
      
      console.log(`✅ Quiz ${idQuiz} eliminado de la lista local`);
      
      return true;
      
    } catch (error: any) {
      let message = "Error al eliminar el quiz";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error("Error al eliminar quiz:", error);
      return false;
    } finally {
      loading.value = false;
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