// src/stores/UsuarioEstadisticas.ts - Versión corregida
import { defineStore } from "pinia";
import { ref } from "vue";

export interface EstadisticasUsuario {
  idUsuario: number;
  totalCursos: number;
  totalVideos: number;
  totalQuizzes: number;
  fechaUltimaActividad: string;
}

export const useUsuarioEstadisticasStore = defineStore("usuarioEstadisticas", () => {
  // --------------------------- Estado ---------------------------
  const estadisticas = ref<Map<number, EstadisticasUsuario>>(new Map());
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos ---------------------------
  
  // Obtener estadísticas de un usuario específico (versión optimizada)
  async function fetchEstadisticasUsuario(idUsuario: number): Promise<EstadisticasUsuario | null> {
    loading.value = true;
    try {
      // Primero intentamos usar el endpoint consolidado
      const response = await fetch(`https://academiqapi.retocsv.es/api/Estadisticas/usuario/${idUsuario}`);
      
      if (response.ok) {
        const stats = await response.json();
        const estadisticasFormateadas: EstadisticasUsuario = {
          idUsuario: stats.idUsuario,
          totalCursos: stats.totalCursos || 0,
          totalVideos: stats.totalVideos || 0,
          totalQuizzes: stats.totalQuizzes || 0,
          fechaUltimaActividad: stats.fechaUltimaActividad || new Date().toISOString()
        };
        
        estadisticas.value.set(idUsuario, estadisticasFormateadas);
        return estadisticasFormateadas;
      } else {
        // Fallback: usar múltiples endpoints individuales
        return await fetchEstadisticasIndividuales(idUsuario);
      }
    } catch (error: any) {
      console.error("Error con endpoint consolidado, probando endpoints individuales:", error);
      // Fallback: usar múltiples endpoints individuales
      return await fetchEstadisticasIndividuales(idUsuario);
    } finally {
      loading.value = false;
    }
  }

  // Método fallback usando endpoints individuales
  async function fetchEstadisticasIndividuales(idUsuario: number): Promise<EstadisticasUsuario | null> {
    try {
      const [totalCursos, totalVideos, totalQuizzes] = await Promise.all([
        fetchCursosPorUsuario(idUsuario),
        fetchVideosPorUsuario(idUsuario),
        fetchQuizzesPorUsuario(idUsuario)
      ]);

      const stats: EstadisticasUsuario = {
        idUsuario,
        totalCursos,
        totalVideos,
        totalQuizzes,
        fechaUltimaActividad: new Date().toISOString()
      };

      estadisticas.value.set(idUsuario, stats);
      return stats;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener estadísticas del usuario:", error);
      
      // Si falla todo, devolver estadísticas en 0
      const statsVacias: EstadisticasUsuario = {
        idUsuario,
        totalCursos: 0,
        totalVideos: 0,
        totalQuizzes: 0,
        fechaUltimaActividad: new Date().toISOString()
      };
      
      estadisticas.value.set(idUsuario, statsVacias);
      return statsVacias;
    }
  }

  // Obtener estadísticas de múltiples usuarios (optimizado)
  async function fetchEstadisticasMultiplesUsuarios(idsUsuarios: number[]): Promise<Map<number, EstadisticasUsuario>> {
    loading.value = true;
    const resultados = new Map<number, EstadisticasUsuario>();
    
    try {
      // Procesar en lotes de 5 para no sobrecargar el servidor
      const lotes = [];
      for (let i = 0; i < idsUsuarios.length; i += 5) {
        lotes.push(idsUsuarios.slice(i, i + 5));
      }
      
      for (const lote of lotes) {
        const promesas = lote.map(id => fetchEstadisticasUsuario(id));
        const estadisticasArray = await Promise.all(promesas);
        
        estadisticasArray.forEach((stats, index) => {
          if (stats) {
            resultados.set(lote[index], stats);
          }
        });
      }
      
      return resultados;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener estadísticas múltiples:", error);
      return resultados;
    } finally {
      loading.value = false;
    }
  }

  // Métodos auxiliares para obtener datos específicos del backend
  async function fetchCursosPorUsuario(idUsuario: number): Promise<number> {
    try {
      const response = await fetch(`https://academiqapi.retocsv.es/api/Curso/usuario/${idUsuario}`);
      
      if (!response.ok) {
        console.warn(`API Curso no disponible (${response.status}), devolviendo 0`);
        return 0;
      }
      
      const cursos = await response.json();
      return Array.isArray(cursos) ? cursos.length : 0;
    } catch (error) {
      console.warn("Error al obtener cursos del usuario, devolviendo 0:", error);
      return 0;
    }
  }

  async function fetchVideosPorUsuario(idUsuario: number): Promise<number> {
    try {
      const response = await fetch(`https://academiqapi.retocsv.es/api/Video/usuario/${idUsuario}`);
      
      if (!response.ok) {
        console.warn(`API Video no disponible (${response.status}), devolviendo 0`);
        return 0;
      }
      
      const videos = await response.json();
      return Array.isArray(videos) ? videos.length : 0;
    } catch (error) {
      console.warn("Error al obtener videos del usuario, devolviendo 0:", error);
      return 0;
    }
  }

  async function fetchQuizzesPorUsuario(idUsuario: number): Promise<number> {
    try {
      const response = await fetch(`https://academiqapi.retocsv.es/api/Quiz/usuario/${idUsuario}`);
      
      if (!response.ok) {
        console.warn(`API Quiz no disponible (${response.status}), devolviendo 0`);
        return 0;
      }
      
      const quizzes = await response.json();
      return Array.isArray(quizzes) ? quizzes.length : 0;
    } catch (error) {
      console.warn("Error al obtener quizzes del usuario, devolviendo 0:", error);
      return 0;
    }
  }

  // Obtener estadísticas desde caché o API
  function getEstadisticasUsuario(idUsuario: number): EstadisticasUsuario | null {
    return estadisticas.value.get(idUsuario) || null;
  }

  // Limpiar caché de estadísticas
  function limpiarCache() {
    estadisticas.value.clear();
  }

  // Obtener todas las estadísticas cacheadas
  function getAllEstadisticas(): EstadisticasUsuario[] {
    return Array.from(estadisticas.value.values());
  }

  return {
    estadisticas,
    errorMessage,
    loading,
    fetchEstadisticasUsuario,
    fetchEstadisticasMultiplesUsuarios,
    getEstadisticasUsuario,
    limpiarCache,
    getAllEstadisticas
  };
});