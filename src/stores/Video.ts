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
        vistas: Math.floor(Math.random() * 10) + 'K', // Simulación
        fecha: 'Hace ' + Math.floor(Math.random() * 10) + ' días' // Simulación
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
        vistas: Math.floor(Math.random() * 10) + 'K', // Simulación
        fecha: 'Hace ' + Math.floor(Math.random() * 10) + ' días' // Simulación
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
        vistas: Math.floor(Math.random() * 10) + 'K', // Simulación
        fecha: 'Hace ' + Math.floor(Math.random() * 10) + ' días' // Simulación
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
        titulo: 'Introducción a las ecuaciones',
        descripcion: 'En este video aprenderemos los conceptos básicos de ecuaciones.',
        url: 'https://www.youtube.com/watch?v=ejemplo1',
        miniatura: 'https://picsum.photos/id/10/300/200',
        fechaSubida: '2023-05-15T10:00:00',
        idAsignatura: 1,
        asignatura: 'Mates',
        idUsuario: 1,
        autor: 'Profesor García',
        vistas: '10K',
        fecha: 'Hace 2 días',
        idCurso: 1
      },
      {
        idVideo: 2,
        titulo: 'Análisis de "Don Quijote"',
        descripcion: 'Un análisis profundo de la obra maestra de Cervantes.',
        url: 'https://www.youtube.com/watch?v=ejemplo2',
        miniatura: 'https://picsum.photos/id/20/300/200',
        fechaSubida: '2023-05-10T14:30:00',
        idAsignatura: 2,
        asignatura: 'Lengua',
        idUsuario: 2,
        autor: 'Profesora Martínez',
        vistas: '5.2K',
        fecha: 'Hace 1 semana',
        idCurso: 2
      },
      {
        idVideo: 3,
        titulo: 'La Segunda Guerra Mundial',
        descripcion: 'Repaso de los eventos principales de la Segunda Guerra Mundial.',
        url: 'https://www.youtube.com/watch?v=ejemplo3',
        miniatura: 'https://picsum.photos/id/30/300/200',
        fechaSubida: '2023-05-12T09:15:00',
        idAsignatura: 3,
        asignatura: 'Historia',
        idUsuario: 3,
        autor: 'Profesor López',
        vistas: '8.7K',
        fecha: 'Hace 3 días',
        idCurso: 3
      },
      {
        idVideo: 4,
        titulo: 'Elementos químicos básicos',
        descripcion: 'Aprende los elementos químicos fundamentales de la tabla periódica.',
        url: 'https://www.youtube.com/watch?v=ejemplo4',
        miniatura: 'https://picsum.photos/id/40/300/200',
        fechaSubida: '2023-05-08T11:45:00',
        idAsignatura: 4,
        asignatura: 'Química',
        idUsuario: 4,
        autor: 'Profesora Sánchez',
        vistas: '3.9K',
        fecha: 'Hace 5 días',
        idCurso: 1
      },
      {
        idVideo: 5,
        titulo: 'La célula y sus partes',
        descripcion: 'Todo lo que necesitas saber sobre la célula y su estructura.',
        url: 'https://www.youtube.com/watch?v=ejemplo5',
        miniatura: 'https://picsum.photos/id/50/300/200',
        fechaSubida: '2023-05-14T13:20:00',
        idAsignatura: 5,
        asignatura: 'Biología',
        idUsuario: 5,
        autor: 'Profesor Rodríguez',
        vistas: '7.3K',
        fecha: 'Hace 1 día',
        idCurso: 2
      },
      {
        idVideo: 6,
        titulo: 'Presente simple en inglés',
        descripcion: 'Aprende a usar correctamente el presente simple en inglés.',
        url: 'https://www.youtube.com/watch?v=ejemplo6',
        miniatura: 'https://picsum.photos/id/60/300/200',
        fechaSubida: '2023-05-11T16:00:00',
        idAsignatura: 6,
        asignatura: 'Inglés',
        idUsuario: 6,
        autor: 'Profesora Wilson',
        vistas: '6.5K',
        fecha: 'Hace 4 días',
        idCurso: 3
      },
      {
        idVideo: 7,
        titulo: 'Fuerzas y movimiento',
        descripcion: 'Principios básicos de la física mecánica.',
        url: 'https://www.youtube.com/watch?v=ejemplo7',
        miniatura: 'https://picsum.photos/id/70/300/200',
        fechaSubida: '2023-05-01T08:30:00',
        idAsignatura: 7,
        asignatura: 'Física',
        idUsuario: 7,
        autor: 'Profesor Hernández',
        vistas: '4.2K',
        fecha: 'Hace 2 semanas',
        idCurso: 1
      },
      {
        idVideo: 8,
        titulo: 'Perspectiva en el dibujo',
        descripcion: 'Técnicas para lograr una buena perspectiva en tus dibujos.',
        url: 'https://www.youtube.com/watch?v=ejemplo8',
        miniatura: 'https://picsum.photos/id/80/300/200',
        fechaSubida: '2023-05-07T10:15:00',
        idAsignatura: 8,
        asignatura: 'Arte',
        idUsuario: 8,
        autor: 'Profesora Gómez',
        vistas: '2.8K',
        fecha: 'Hace 6 días',
        idCurso: 2
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