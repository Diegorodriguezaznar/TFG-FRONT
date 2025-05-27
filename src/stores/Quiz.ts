import { defineStore } from "pinia";
import { ref } from "vue";
import type { QuizDTO } from "@/stores/dtos/QuizDTO";
import type { QuizCompletaDTO } from "@/stores/dtos/QuizCompletaDTO";
import { useUsuarioStore } from "@/stores/Usuario";

export const useQuizStore = defineStore("quiz", () => {
  const quizzes = ref<QuizCompletaDTO[]>([]);
  const quizCompleto = ref<QuizCompletaDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // GET - Obtener todos los quizzes
  async function fetchAllQuizzes(): Promise<QuizCompletaDTO[]> {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:5190/api/quiz");
      if (!response.ok) throw new Error("Error al obtener todos los quizzes");

      const quizzesData = await response.json();
      
      const usuarioStore = useUsuarioStore();
      await usuarioStore.fetchAllUsuarios();
      
      quizzes.value = quizzesData.map((quiz: QuizDTO) => {
        const usuario = usuarioStore.usuarios.find(u => u.idUsuario === quiz.idUsuario);

        return {
          idQuiz: quiz.idQuiz,
          nombre: quiz.nombre,
          descripcion: quiz.descripcion,
          nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Usuario desconocido',
          fechaCreacion: new Date().toLocaleDateString(),
          totalPreguntas: 0,
          idCurso: quiz.idCurso,  
          idAsignatura: quiz.idAsignatura,
          idUsuario: quiz.idUsuario
        };
      });

      return quizzes.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener todos los quizzes";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // GET - Obtener quiz por ID
  async function fetchQuizById(idQuiz: number): Promise<QuizDTO | null> {
    try {
      const response = await fetch(`http://localhost:5190/api/quiz/${idQuiz}`);
      if (!response.ok) throw new Error("Error al obtener el quiz");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener el quiz";
      return null;
    }
  }

  // GET - Obtener quiz completo por ID
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
        totalPreguntas: 0,
        idAsignatura: quizData.idAsignatura,
        idCurso: quizData.idCurso,
        idUsuario: quizData.idUsuario
      };

      return quizCompleto.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener quiz completo";
      return null;
    }
  }

  // GET - Obtener quizzes por usuario
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
        idCurso: quiz.idCurso,
        idUsuario: quiz.idUsuario
      }));
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener quizzes por usuario";
      return [];
    }
  }

  // GET - Obtener quizzes por curso
  async function fetchQuizzesByCurso(idCurso: number): Promise<QuizCompletaDTO[]> {
    loading.value = true;
    try {
      const response = await fetch(`http://localhost:5190/api/quiz/curso/${idCurso}`);
      if (!response.ok) throw new Error("Error al obtener los quizzes del curso");

      const quizzesData = await response.json();

      const usuarioStore = useUsuarioStore();
      await usuarioStore.fetchAllUsuarios();

      quizzes.value = quizzesData.map((quiz: QuizDTO) => {
        const usuario = usuarioStore.usuarios.find(u => u.idUsuario === quiz.idUsuario);
        return {
          idQuiz: quiz.idQuiz,
          nombre: quiz.nombre,
          descripcion: quiz.descripcion,
          nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Usuario desconocido',
          fechaCreacion: new Date().toLocaleDateString(),
          totalPreguntas: 0,
          idCurso: quiz.idCurso,
          idAsignatura: quiz.idAsignatura,
          idUsuario: quiz.idUsuario
        };
      });

      return quizzes.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener quizzes por curso";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // POST - Crear quiz
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
      await fetchAllQuizzes();
      
      return createdQuiz;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al crear el quiz";
      return null;
    }
  }

  // PUT - Actualizar quiz
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
      await fetchAllQuizzes();
      
      return updatedQuiz;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al actualizar el quiz";
      return null;
    }
  }

  // DELETE - Eliminar quiz
  async function deleteQuiz(idQuiz: number, idUsuario?: number): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

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
          // Error silencioso al parsear
        }
        
        throw new Error(`Error al eliminar el quiz: ${errorMessage}`);
      }

      quizzes.value = quizzes.value.filter(q => q.idQuiz !== idQuiz);
      return true;
      
    } catch (error: any) {
      errorMessage.value = error.message || "Error al eliminar el quiz";
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
    fetchQuizzesByCurso,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
});