import { defineStore } from "pinia";
import { ref } from "vue";
import type { VideoDTO } from "@/stores/dtos/VideoDTO";
import type { PagedResult, PaginationParams } from "@/stores/dtos/PagedResult";

export const useVideoStore = defineStore("video", () => {
  // Estado
  const videos = ref<VideoDTO[]>([]);
  const videosPaged = ref<PagedResult<VideoDTO> | null>(null);
  const videosUsuarioPaged = ref<PagedResult<VideoDTO> | null>(null);
  const videosCursoPaged = ref<PagedResult<VideoDTO> | null>(null);
  const videosFiltradosPorCurso = ref<VideoDTO[]>([]);
  const videosReportados = ref<VideoDTO[]>([]);
  const video = ref<VideoDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // GET paginado de todos los videos
  async function fetchAllVideosPaged(params: PaginationParams = {}): Promise<PagedResult<VideoDTO> | null> {
    loading.value = true;
    try {
      const { page = 1, pageSize = 10 } = params;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://academiqapi.retocsv.es/api/Video/paged?page=${page}&pageSize=${pageSize}`,
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
          `Error al obtener los videos paginados: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data: PagedResult<any> = await response.json();

      const mappedVideos = data.items.map((v: any) => mapVideoFromAPI(v));

      videosPaged.value = {
        ...data,
        items: mappedVideos
      };

      return videosPaged.value;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al obtener los videos paginados");
      errorMessage.value = message;
      
      // Fallback con datos simulados
      videosPaged.value = {
        items: simulateVideos(),
        totalCount: 1,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      };
      
      return videosPaged.value;
    } finally {
      loading.value = false;
    }
  }

  //  GET paginado de videos por curso
  async function fetchVideosByCursoPaged(
    idCurso: number, 
    params: PaginationParams = {}
  ): Promise<PagedResult<VideoDTO> | null> {
    loading.value = true;
    try {
      const { page = 1, pageSize = 10 } = params;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://academiqapi.retocsv.es/api/Video/curso/${idCurso}/paged?page=${page}&pageSize=${pageSize}`,
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
          `Error al obtener los videos del curso paginados: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data: PagedResult<any> = await response.json();

      const mappedVideos = data.items.map((v: any) => mapVideoFromAPI(v));

      videosCursoPaged.value = {
        ...data,
        items: mappedVideos
      };

      return videosCursoPaged.value;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al obtener los videos del curso paginados");
      errorMessage.value = message;
      
      videosCursoPaged.value = {
        items: simulateVideosByCurso(idCurso),
        totalCount: 1,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      };
      
      return videosCursoPaged.value;
    } finally {
      loading.value = false;
    }
  }

  //Mapear video desde API
  function mapVideoFromAPI(v: any): VideoDTO {
    return {
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
      numReportes: v.numReportes || 0,
      contadorLikes: v.contadorLikes || 0 
    };
  }

  // Manejo de errores
  function getErrorMessage(error: any, defaultMessage: string): string {
    if (error.name === "AbortError") {
      return "La conexión con el servidor ha excedido el tiempo de espera";
    }
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      return "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
    }
    return error.message || defaultMessage;
  }


  async function fetchAllVideos() {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://academiqapi.retocsv.es/api/Video", {
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
      videos.value = data.map((v: any) => mapVideoFromAPI(v));
      return videos.value;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al obtener los videos");
      errorMessage.value = message;
      videos.value = simulateVideos();
      return videos.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchVideosByCurso(idCurso: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://academiqapi.retocsv.es/api/Video/curso/${idCurso}`,
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
      videosFiltradosPorCurso.value = data.map((v: any) => mapVideoFromAPI(v));
      return videosFiltradosPorCurso.value;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al obtener los videos del curso");
      errorMessage.value = message;
      videosFiltradosPorCurso.value = simulateVideosByCurso(idCurso);
      return videosFiltradosPorCurso.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchVideoById(idVideo: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://academiqapi.retocsv.es/api/Video/${idVideo}`, {
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
      video.value = mapVideoFromAPI(v);
      return video.value;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al obtener el video");
      errorMessage.value = message;
      const videosSimulados = simulateVideos();
      video.value = videosSimulados.find((v) => v.idVideo === idVideo) || null;
      return video.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchVideosReportados() {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://academiqapi.retocsv.es/api/Video/reportados`, {
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

      videosReportados.value = data
        .map((v: any) => mapVideoFromAPI(v))
        .sort((a: VideoDTO, b: VideoDTO) => (b.numReportes || 0) - (a.numReportes || 0));

      return videosReportados.value;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al obtener los videos reportados");
      errorMessage.value = message;
      videosReportados.value = simulateVideosReportados();
      return videosReportados.value;
    } finally {
      loading.value = false;
    }
  }

  async function aprobarVideo(idVideo: number) {
    loading.value = true;
    try {
      const response = await fetch(`https://academiqapi.retocsv.es/api/ReporteVideo/aprobar/${idVideo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error al aprobar el video: ${response.status}`);
      }
      
      videosReportados.value = videosReportados.value.filter(v => v.idVideo !== idVideo);
      return true;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al aprobar el video");
      errorMessage.value = message;
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  async function eliminarVideo(idVideo: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`https://academiqapi.retocsv.es/api/Video/${idVideo}`, {
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
      
      videosReportados.value = videosReportados.value.filter(v => v.idVideo !== idVideo);
      videos.value = videos.value.filter(v => v.idVideo !== idVideo);
      
      return true;
    } catch (error: any) {
      const message = getErrorMessage(error, "Error al eliminar el video");
      errorMessage.value = message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function eliminarVideoPropio(idVideo: number): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`https://academiqapi.retocsv.es/api/Video/borrar-propio/${idVideo}`, {
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
      return false;
    }
  }

  // Funciones de simulación (sin cambios)
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

  function simulateVideosByCurso(idCurso: number): VideoDTO[] {
    return simulateVideos().filter((v) => v.idCurso === idCurso);
  }

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
    // Estado
    videos,
    videosPaged,
    videosUsuarioPaged,
    videosCursoPaged,
    videosFiltradosPorCurso,
    videosReportados,
    video,
    loading,
    errorMessage,
    
    //  paginación
    fetchAllVideosPaged,
    fetchVideosByCursoPaged,
    
    fetchAllVideos,
    fetchVideosByCurso,
    fetchVideoById,
    fetchVideosReportados,
    aprobarVideo,
    eliminarVideo,
    eliminarVideoPropio,
  };
});