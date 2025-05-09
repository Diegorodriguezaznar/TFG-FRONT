import { defineStore } from "pinia";
import { ref } from "vue";
import type { VideoDTO } from "@/stores/dtos/VideoDTO";

export const useVideoStore = defineStore("video", () => {
  // --------------------------- Estado ---------------------------
  const videos = ref<VideoDTO[]>([]);
  const videosFiltradosPorCurso = ref<VideoDTO[]>([]);
  const video = ref<VideoDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos de Fetch ---------------------------
  
  // Obtener todos los videos
  async function fetchAllVideos() {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch("http://localhost:5190/api/Video", {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener los videos: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      
      // Transformar los datos para adaptarlos a nuestro DTO
      videos.value = data.map((v: any) => ({
        idVideo: v.idVideo,
        titulo: v.titulo,
        descripcion: v.descripcion,
        url: v.url,
        miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
        fechaSubida: v.fechaSubida,
        idAsignatura: v.idAsignatura,
        asignatura: v.asignatura?.nombre || 'General',
        idUsuario: v.idUsuario,
        autor: v.usuario?.nombre || 'Profesor',
        idCurso: v.idCurso,
        duracion: v.duracion,
        vistas: Math.floor(Math.random() * 10) + 'K',
        fecha: 'Hace ' + Math.floor(Math.random() * 10) + ' días'
      }));
      
      return videos.value;
    } catch (error: any) {
      let message = "Error al obtener los videos";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      
      // Fallback con datos de ejemplo en caso de error
      videos.value = simulateVideos();
      return videos.value;
    } finally {
      loading.value = false;
    }
  }

  // Obtener videos por curso
  async function fetchVideosByCurso(idCurso: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/Video/curso/${idCurso}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener los videos del curso: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      
      // Transformar los datos para adaptarlos a nuestro DTO
      videosFiltradosPorCurso.value = data.map((v: any) => ({
        idVideo: v.idVideo,
        titulo: v.titulo,
        descripcion: v.descripcion,
        url: v.url,
        miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
        fechaSubida: v.fechaSubida,
        idAsignatura: v.idAsignatura,
        asignatura: v.asignatura?.nombre || 'General',
        idUsuario: v.idUsuario,
        autor: v.usuario?.nombre || 'Profesor',
        idCurso: v.idCurso,
        duracion: v.duracion,
        vistas: Math.floor(Math.random() * 10) + 'K',
        fecha: 'Hace ' + Math.floor(Math.random() * 10) + ' días'
      }));
      
      return videosFiltradosPorCurso.value;
    } catch (error: any) {
      let message = "Error al obtener los videos del curso";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      
      // Fallback con datos de ejemplo en caso de error
      videosFiltradosPorCurso.value = simulateVideosByCurso(idCurso);
      return videosFiltradosPorCurso.value;
    } finally {
      loading.value = false;
    }
  }

  // Obtener un video por ID
  async function fetchVideoById(idVideo: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/Video/${idVideo}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener el video: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const v = await response.json();
      
      // Transformar los datos para adaptarlos a nuestro DTO
      video.value = {
        idVideo: v.idVideo,
        titulo: v.titulo,
        descripcion: v.descripcion,
        url: v.url,
        miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
        fechaSubida: v.fechaSubida,
        idAsignatura: v.idAsignatura,
        asignatura: v.asignatura?.nombre || 'General',
        idUsuario: v.idUsuario,
        autor: v.usuario?.nombre || 'Profesor',
        idCurso: v.idCurso,
        duracion: v.duracion,
        vistas: Math.floor(Math.random() * 10) + 'K',
        fecha: 'Hace ' + Math.floor(Math.random() * 10) + ' días'
      };
      
      return video.value;
    } catch (error: any) {
      let message = "Error al obtener el video";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      
      // Fallback con datos de ejemplo en caso de error
      const videosSimulados = simulateVideos();
      video.value = videosSimulados.find(v => v.idVideo === idVideo) || null;
      return video.value;
    } finally {
      loading.value = false;
    }
  }

  // --------------------------- Datos de ejemplo para fallback ---------------------------
  function simulateVideos(): VideoDTO[] {
    return [
      {
        idVideo: 1,
        titulo: 'NO HAY VIDEOS',
        descripcion: '',
        url: '',
        miniatura: '',
        fechaSubida: '2023-05-15T10:00:00',
        idAsignatura: 1,
        asignatura: 'ERROR',
        idUsuario: 1,
        autor: 'ERROR',
        vistas: '10K',
        fecha: 'ERROR',
        idCurso: 1,
        duracion: '00:00'
      }
    ];
  }

  // Simular videos específicos de un curso
  function simulateVideosByCurso(idCurso: number): VideoDTO[] {
    return simulateVideos().filter(v => v.idCurso === idCurso);
  }

  return { 
    videos,
    videosFiltradosPorCurso,
    video,
    loading,
    fetchAllVideos,
    fetchVideosByCurso,
    fetchVideoById,
    errorMessage
  };
});