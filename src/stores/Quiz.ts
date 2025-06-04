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

  // Método utilitario formatear fecha
  const formatFecha = (fecha: string): string => {
    try {
      if (!fecha) return 'Fecha no disponible';
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', fecha, error);
      return 'Fecha inválida';
    }
  };

  // Método utilitario obtener nombre de usuario
  const obtenerNombreUsuario = (usuario: any): string => {
    if (!usuario) return 'Usuario desconocido';
    return `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim() || 'Usuario desconocido';
  };

  // Método GET obtener todos los quizzes
  async function fetchAllQuizzes(): Promise<QuizCompletaDTO[]> {
    loading.value = true;
    try {
      console.log('FETCH ALL QUIZZES');
      const response = await fetch("https://academiqapi.retocsv.es/api/quiz");
      if (!response.ok) throw new Error("Error al obtener todos los quizzes");

      const quizzesData = await response.json();
      console.log('Quizzes raw del servidor:', quizzesData);
      
      const usuarioStore = useUsuarioStore();
      await usuarioStore.fetchAllUsuarios();
      console.log('Usuarios cargados:', usuarioStore.usuarios.length);
      
      quizzes.value = quizzesData.map((quiz: QuizCompletaDTO) => {
        const usuario = usuarioStore.usuarios.find(u => u.idUsuario === quiz.idUsuario);
        console.log(`Procesando quiz ${quiz.idQuiz}:`, {
          nombre: quiz.nombre,
          fechaCreacion: quiz.fechaCreacion,
          idUsuario: quiz.idUsuario,
          usuario: usuario
        });

        return {
          idQuiz: quiz.idQuiz,
          nombre: quiz.nombre || 'Sin título',
          descripcion: quiz.descripcion || '',
          nombreUsuario: obtenerNombreUsuario(usuario),
          fechaCreacion: formatFecha(quiz.fechaCreacion),
          totalPreguntas: 0,
          idCurso: quiz.idCurso,  
          idAsignatura: quiz.idAsignatura,
          idUsuario: quiz.idUsuario
        };
      });

      console.log('Quizzes procesados:', quizzes.value);
      return quizzes.value;
    } catch (error: any) {
      console.error('Error en fetchAllQuizzes:', error);
      errorMessage.value = error.message || "Error al obtener todos los quizzes";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Método GET obtener quiz por ID
  async function fetchQuizById(idQuiz: number): Promise<QuizDTO | null> {
    try {
      console.log('FETCH QUIZ BY ID');
      console.log('ID solicitado:', idQuiz);
      console.log('Tipo del ID:', typeof idQuiz);
      
      const url = `https://academiqapi.retocsv.es/api/quiz/${idQuiz}`;
      console.log('URL completa:', url);
      
      console.log('Realizando fetch...');
      const response = await fetch(url);
      
      console.log('Respuesta recibida:');
      console.log('- Status:', response.status);
      console.log('- StatusText:', response.statusText);
      console.log('- OK:', response.ok);
      
      if (!response.ok) {
        console.error(`Response no OK: ${response.status} ${response.statusText}`);
        
        try {
          const errorText = await response.text();
          console.error('Error body:', errorText);
        } catch (e) {
          console.error('No se pudo leer el error body');
        }
        
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      console.log('Parseando JSON...');
      const data = await response.json();
      console.log('Datos recibidos:', data);
      console.log('Tipo de datos:', typeof data);
      
      if (!data) {
        console.warn('Los datos están vacíos o son null');
        return null;
      }
      
      const requiredProps = ['idQuiz', 'nombre', 'idUsuario', 'fechaCreacion'];
      const missingProps = requiredProps.filter(prop => !(prop in data));
      
      if (missingProps.length > 0) {
        console.warn('Propiedades faltantes en el quiz:', missingProps);
        console.warn('Propiedades disponibles:', Object.keys(data));
      }
      
      console.log('Quiz obtenido exitosamente');
      return data;

    } catch (error: any) {
      console.error('ERROR EN FETCH QUIZ BY ID');
      console.error('ID solicitado:', idQuiz);
      console.error('Error:', error);
      console.error('Tipo de error:', typeof error);
      console.error('Mensaje:', error.message);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Error de red - El servidor puede estar caído');
        errorMessage.value = "Error de conexión. Verifica que el servidor esté funcionando.";
      } else if (error.message.includes('404')) {
        console.error('Quiz no encontrado (404)');
        errorMessage.value = `Quiz con ID ${idQuiz} no encontrado`;
      } else {
        errorMessage.value = error.message || "Error al obtener el quiz";
      }
      
      return null;
    }
  }

  // Método GET obtener quiz completo por ID
  async function fetchQuizCompletoById(idQuiz: number): Promise<QuizCompletaDTO | null> {
    try {
      console.log('FETCH QUIZ COMPLETO BY ID');
      console.log('ID solicitado:', idQuiz);
      
      const quizData = await fetchQuizById(idQuiz);
      if (!quizData) {
        console.error('fetchQuizById devolvió null');
        return null;
      }

      console.log('Quiz básico obtenido:', quizData);

      const usuarioStore = useUsuarioStore();
      console.log('Obteniendo usuario ID:', quizData.idUsuario);
      const usuario = await usuarioStore.fetchUsuarioById(quizData.idUsuario);
      console.log('Usuario obtenido:', usuario);
      
      quizCompleto.value = {
        idQuiz: quizData.idQuiz,
        nombre: quizData.nombre || 'Sin título',
        descripcion: quizData.descripcion || '',
        nombreUsuario: obtenerNombreUsuario(usuario),
        fechaCreacion: formatFecha(quizData.fechaCreacion),
        totalPreguntas: 0,
        idAsignatura: quizData.idAsignatura,
        idCurso: quizData.idCurso,
        idUsuario: quizData.idUsuario
      };

      console.log('Quiz completo creado:', quizCompleto.value);
      return quizCompleto.value;
    } catch (error: any) {
      console.error(`Error en fetchQuizCompletoById(${idQuiz}):`, error);
      errorMessage.value = error.message || "Error al obtener quiz completo";
      return null;
    }
  }

  // Método GET obtener quizzes por usuario
  async function fetchQuizzesByUsuario(idUsuario: number): Promise<QuizCompletaDTO[]> {
    try {
      console.log(`FETCH QUIZZES BY USUARIO ${idUsuario}`);
      const response = await fetch(`https://academiqapi.retocsv.es/api/quiz/usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener los quizzes del usuario");

      const quizzesData = await response.json();
      console.log('Quizzes del usuario:', quizzesData);
      
      const usuarioStore = useUsuarioStore();
      const usuario = await usuarioStore.fetchUsuarioById(idUsuario);

      return quizzesData.map((quiz: QuizCompletaDTO) => ({
        idQuiz: quiz.idQuiz,
        nombre: quiz.nombre || 'Sin título',
        descripcion: quiz.descripcion || '',
        nombreUsuario: obtenerNombreUsuario(usuario),
        fechaCreacion: formatFecha(quiz.fechaCreacion),
        totalPreguntas: 0,
        idAsignatura: quiz.idAsignatura,
        idCurso: quiz.idCurso,
        idUsuario: quiz.idUsuario
      }));
    } catch (error: any) {
      console.error(`Error en fetchQuizzesByUsuario(${idUsuario}):`, error);
      errorMessage.value = error.message || "Error al obtener quizzes por usuario";
      return [];
    }
  }

  // Método GET obtener quizzes por curso
  async function fetchQuizzesByCurso(idCurso: number): Promise<QuizCompletaDTO[]> {
    loading.value = true;
    try {
      console.log(`FETCH QUIZZES BY CURSO ${idCurso}`);
      const response = await fetch(`https://academiqapi.retocsv.es/api/quiz/curso/${idCurso}`);
      if (!response.ok) throw new Error("Error al obtener los quizzes del curso");

      const quizzesData = await response.json();
      console.log('Quizzes del curso:', quizzesData);

      const usuarioStore = useUsuarioStore();
      await usuarioStore.fetchAllUsuarios();

      quizzes.value = quizzesData.map((quiz: QuizCompletaDTO) => {
        const usuario = usuarioStore.usuarios.find(u => u.idUsuario === quiz.idUsuario);
        console.log(`Procesando quiz ${quiz.idQuiz} del curso:`, {
          nombre: quiz.nombre,
          fechaCreacion: quiz.fechaCreacion,
          usuario: usuario
        });
        
        return {
          idQuiz: quiz.idQuiz,
          nombre: quiz.nombre || 'Sin título',
          descripcion: quiz.descripcion || '',
          nombreUsuario: obtenerNombreUsuario(usuario),
          fechaCreacion: formatFecha(quiz.fechaCreacion),
          totalPreguntas: 0,
          idCurso: quiz.idCurso,
          idAsignatura: quiz.idAsignatura,
          idUsuario: quiz.idUsuario
        };
      });

      console.log('Quizzes del curso procesados:', quizzes.value);
      return quizzes.value;
    } catch (error: any) {
      console.error(`Error en fetchQuizzesByCurso(${idCurso}):`, error);
      errorMessage.value = error.message || "Error al obtener quizzes por curso";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Método POST crear quiz
  async function createQuiz(quiz: Omit<QuizDTO, 'idQuiz'>): Promise<QuizDTO | null> {
    try {
      console.log('CREAR QUIZ');
      console.log('Datos del quiz:', quiz);
      
      const response = await fetch("https://academiqapi.retocsv.es/api/quiz", {
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
      console.log('Quiz creado:', createdQuiz);
      
      await fetchAllQuizzes();
      
      return createdQuiz;
    } catch (error: any) {
      console.error('Error en createQuiz:', error);
      errorMessage.value = error.message || "Error al crear el quiz";
      return null;
    }
  }

  // Método PUT actualizar quiz
  async function updateQuiz(idQuiz: number, updatedData: Partial<QuizDTO>): Promise<QuizDTO | null> {
    try {
      console.log(`ACTUALIZAR QUIZ ${idQuiz}`);
      console.log('Datos a actualizar:', updatedData);
      
      const response = await fetch(`https://academiqapi.retocsv.es/api/quiz/${idQuiz}`, {
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
      console.log('Quiz actualizado:', updatedQuiz);
      
      await fetchAllQuizzes();
      
      return updatedQuiz;
    } catch (error: any) {
      console.error(`Error en updateQuiz(${idQuiz}):`, error);
      errorMessage.value = error.message || "Error al actualizar el quiz";
      return null;
    }
  }

  // Método DELETE eliminar quiz
  async function deleteQuiz(idQuiz: number, idUsuario?: number): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";
    
    try {
      console.log(`ELIMINAR QUIZ ${idQuiz}`);
      console.log('ID Usuario:', idUsuario);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let url = `https://academiqapi.retocsv.es/api/Quiz/${idQuiz}`;
      if (idUsuario) {
        url += `?idUsuario=${idUsuario}`;
      }
      
      console.log('URL de eliminación:', url);
      
      let response;
      try {
        response = await fetch(url, {
          method: "DELETE",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        const fallbackUrl = `https://academiqapi.retocsv.es/api/quiz/${idQuiz}${idUsuario ? `?idUsuario=${idUsuario}` : ''}`;
        console.log('Intentando URL alternativa:', fallbackUrl);
        response = await fetch(fallbackUrl, {
          method: "DELETE",
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
      }

      clearTimeout(timeoutId);

      console.log('Respuesta del servidor:', response.status, response.statusText);

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
      console.log('Quiz eliminado exitosamente');
      return true;
      
    } catch (error: any) {
      console.error(`Error al eliminar quiz ${idQuiz}:`, error);
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