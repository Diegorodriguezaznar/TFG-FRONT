import { defineStore } from "pinia";
import { ref } from "vue";
import type { VideoDTO } from "@/stores/dtos/VideoDTO";

export const useVideoStore = defineStore("video", () => {
  // --------------------------- Estado ---------------------------
  const videos = ref<VideoDTO[]>([]);
  const videosFiltradosPorCurso = ref<VideoDTO[]>([]);
  const videosReportados = ref<VideoDTO[]>([]);
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
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al obtener los videos: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      videos.value = data.map((v: any) => ({
        idVideo: v.idVideo,
        titulo: v.titulo,
        descripcion: v.descripcion,
        url: v.url,
        miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
        fechaSubida: v.fechaSubida,
        idAsignatura: v.idAsignatura,
        asignatura: v.asignatura?.nombre || "General",
        idUsuario: v.idUsuario,
        autor: v.usuario?.nombre || "Profesor",
        idCurso: v.idCurso,
        duracion: v.duracion,
        vistas: Math.floor(Math.random() * 10) + "K",
        fecha: "Hace " + Math.floor(Math.random() * 10) + " días",
        numReportes: v.numReportes || 0
      }));

      return videos.value;
    } catch (error: any) {
      let message = "Error al obtener los videos";

      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
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

      const response = await fetch(
        `http://localhost:5190/api/Video/curso/${idCurso}`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al obtener los videos del curso: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      videosFiltradosPorCurso.value = data.map((v: any) => ({
        idVideo: v.idVideo,
        titulo: v.titulo,
        descripcion: v.descripcion,
        url: v.url,
        miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
        fechaSubida: v.fechaSubida,
        idAsignatura: v.idAsignatura,
        asignatura: v.asignatura?.nombre || "General",
        idUsuario: v.idUsuario,
        autor: v.usuario?.nombre || "Profesor",
        idCurso: v.idCurso,
        duracion: v.duracion,
        vistas: Math.floor(Math.random() * 10) + "K",
        fecha: "Hace " + Math.floor(Math.random() * 10) + " días",
        numReportes: v.numReportes || 0
      }));

      return videosFiltradosPorCurso.value;
    } catch (error: any) {
      let message = "Error al obtener los videos del curso";

      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
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
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al obtener el video: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const v = await response.json();

      video.value = {
        idVideo: v.idVideo,
        titulo: v.titulo,
        descripcion: v.descripcion,
        url: v.url,
        miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
        fechaSubida: v.fechaSubida,
        idAsignatura: v.idAsignatura,
        asignatura: v.asignatura?.nombre || "General",
        idUsuario: v.idUsuario,
        autor: v.usuario?.nombre || "Profesor",
        idCurso: v.idCurso,
        duracion: v.duracion,
        vistas: Math.floor(Math.random() * 10) + "K",
        fecha: "Hace " + Math.floor(Math.random() * 10) + " días",
        numReportes: v.numReportes || 0
      };

      return video.value;
    } catch (error: any) {
      let message = "Error al obtener el video";

      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }

      errorMessage.value = message;
      console.error(message, error);

      // Fallback con datos de ejemplo en caso de error
      const videosSimulados = simulateVideos();
      video.value = videosSimulados.find((v) => v.idVideo === idVideo) || null;
      return video.value;
    } finally {
      loading.value = false;
    }
  }

  // Obtener videos reportados
  async function fetchVideosReportados() {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`http://localhost:5190/api/Video/reportados`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al obtener los videos reportados: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      // Mapear los datos y ordenar por número de reportes (de mayor a menor)
      videosReportados.value = data
        .map((v: any) => ({
          idVideo: v.idVideo,
          titulo: v.titulo,
          descripcion: v.descripcion,
          url: v.url,
          miniatura: v.miniatura || `https://picsum.photos/id/${v.idVideo}/300/200`,
          fechaSubida: v.fechaSubida,
          idAsignatura: v.idAsignatura,
          asignatura: v.asignatura?.nombre || "General",
          idUsuario: v.idUsuario,
          autor: v.usuario?.nombre || "Profesor",
          idCurso: v.idCurso,
          duracion: v.duracion,
          vistas: Math.floor(Math.random() * 10) + "K",
          fecha: "Hace " + Math.floor(Math.random() * 10) + " días",
          numReportes: v.numReportes || 0
        }))
        .sort((a: VideoDTO, b: VideoDTO) => (b.numReportes || 0) - (a.numReportes || 0));

      return videosReportados.value;
    } catch (error: any) {
      let message = "Error al obtener los videos reportados";

      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }

      errorMessage.value = message;
      console.error(message, error);

      // Fallback con datos de ejemplo en caso de error
      videosReportados.value = simulateVideosReportados();
      return videosReportados.value;
    } finally {
      loading.value = false;
    }
  }

  // Aprobar un video (eliminar reportes)
  async function aprobarVideo(idVideo: number) {
    loading.value = true;
    try {
      // Obtener primero el video completo
      const videoActual = await fetchVideoById(idVideo);
      
      if (!videoActual) {
        throw new Error("No se pudo encontrar el video");
      }
      
      // Actualizar el video para quitar reportes
      const videoActualizado = {
        ...videoActual,
        numReportes: 0
      };
      
      // Llamar al endpoint para actualizar el video
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/Video/${idVideo}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoActualizado),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al aprobar el video: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
      
      // Actualizar la lista de videos reportados
      videosReportados.value = videosReportados.value.filter(v => v.idVideo !== idVideo);
      
      return true;
    } catch (error: any) {
      let message = "Error al aprobar el video";
      
      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  // Eliminar un video
  async function eliminarVideo(idVideo: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/Video/${idVideo}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json"
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al eliminar el video: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
      
      // Actualizar las listas de videos
      videosReportados.value = videosReportados.value.filter(v => v.idVideo !== idVideo);
      videos.value = videos.value.filter(v => v.idVideo !== idVideo);
      
      return true;
    } catch (error: any) {
      let message = "Error al eliminar el video";
      
      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return false;
    } finally {
      loading.value = false;
    }
  }

    async function eliminarVideoPropio(idVideo: number): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no disponible");
      return false;
    }

    try {
      const response = await fetch(`http://localhost:5190/api/Video/borrar-propio/${idVideo}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar vídeo: ${response.status} ${errorText}`);
      }

      return true;
    } catch (error: any) {
      console.error("Error al eliminar vídeo:", error);
      return false;
    }
  }

  // --------------------------- Datos de ejemplo para fallback ---------------------------
  async function aprobarVideo(idVideo: number) {
    loading.value = true;
    try {
      console.log(`%c👍 Aprobando video ID: ${idVideo}`, 'color: #2196f3;');
      
      // Usar el endpoint específico para aprobar
      const response = await fetch(`http://localhost:5190/api/ReporteVideo/aprobar/${idVideo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error al aprobar el video: ${response.status}`);
      }
      
      // Actualizar la lista de videos reportados eliminando el que fue aprobado
      videosReportados.value = videosReportados.value.filter(v => v.idVideo !== idVideo);
      
      console.log(`%c Video aprobado correctamente`, 'color: #42b883;');
      return true;
    } catch (error: any) {
      let message = "Error al aprobar el video";
      
      if (error.name === "AbortError") {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error('%c Error al aprobar video:', 'color: #ff5252;', error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // --------------------------- Datos de ejemplo para fallback ---------------------------
  function simulateVideos(): VideoDTO[] {
    return [
      {
        idVideo: 1,
        titulo: "NO HAY VIDEOS",
        descripcion: "",
        url: "",
        miniatura: "",
        fechaSubida: "2023-05-15T10:00:00",
        idAsignatura: 1,
        asignatura: "ERROR",
        idUsuario: 1,
        autor: "ERROR",
        vistas: "10K",
        fecha: "ERROR",
        idCurso: 1,
        duracion: "00:00",
        numReportes: 0
      },
    ];
  }

  // Simular videos específicos de un curso
  function simulateVideosByCurso(idCurso: number): VideoDTO[] {
    return simulateVideos().filter((v) => v.idCurso === idCurso);
  }

  // Simular videos reportados para fallback
  function simulateVideosReportados(): VideoDTO[] {
    return [
      {
        idVideo: 1,
        titulo: "NO HAY VIDEOS REPORTADOS",
        descripcion: "Error de conexión",
        url: "",
        miniatura: "",
        fechaSubida: "2023-05-15T10:00:00",
        idAsignatura: 1,
        asignatura: "ERROR",
        idUsuario: 1,
        autor: "ERROR",
        vistas: "10K",
        fecha: "ERROR",
        idCurso: 1,
        duracion: "00:00",
        numReportes: 0
      },
    ];
  }

  return {
    videos,
    videosFiltradosPorCurso,
    videosReportados,
    video,
    loading,
    fetchAllVideos,
    fetchVideosByCurso,
    fetchVideoById,
    fetchVideosReportados,
    aprobarVideo,
    eliminarVideo,
    eliminarVideoPropio,
    errorMessage,
  };
});