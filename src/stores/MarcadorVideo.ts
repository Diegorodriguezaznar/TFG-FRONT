import { defineStore } from "pinia";
import { ref } from "vue";
import type { MarcadorVideoDTO } from "@/stores/dtos/MarcadorVideoDTO";

export const useMarcadorVideoStore = defineStore("marcadorVideo", () => {
  // --------------------------- Estado ---------------------------
  const marcadores = ref<MarcadorVideoDTO[]>([]);
  const marcadoresPorVideo = ref<MarcadorVideoDTO[]>([]);
  const marcador = ref<MarcadorVideoDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos de Fetch ---------------------------

  // Obtener marcadores por ID de video
  async function fetchMarcadoresByVideoId(idVideo: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `http://localhost:5190/api/MarcadorVideo/video/${idVideo}`,
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
          `Error al obtener los marcadores: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      marcadoresPorVideo.value = data.map((m: any) => ({
        idMarcador: m.idMarcador,
        idVideo: m.idVideo,
        minutoImportante: m.minutoImportante,
        titulo: m.titulo || ""
      }));

      // Ordenar por minuto importante
      marcadoresPorVideo.value.sort((a, b) => a.minutoImportante - b.minutoImportante);

      return marcadoresPorVideo.value;
    } catch (error: any) {
      let message = "Error al obtener los marcadores del video";

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

      // Fallback con datos vacíos en caso de error
      marcadoresPorVideo.value = [];
      return marcadoresPorVideo.value;
    } finally {
      loading.value = false;
    }
  }

  // Crear un nuevo marcador
  async function createMarcador(marcador: MarcadorVideoDTO) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `http://localhost:5190/api/MarcadorVideo`,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(marcador),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al crear el marcador: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();
      
      // Añadir a la lista local
      marcadoresPorVideo.value.push(data);
      // Ordenar por minuto importante
      marcadoresPorVideo.value.sort((a, b) => a.minutoImportante - b.minutoImportante);
      
      return data;
    } catch (error: any) {
      let message = "Error al crear el marcador";

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
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Crear varios marcadores en lote
  async function createMarcadoresEnLote(idVideo: number, marcadores: MarcadorVideoDTO[]) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Convertir a formato de request para el endpoint bulk
      const marcadoresRequest = marcadores.map(m => ({
        minutoImportante: m.minutoImportante,
        titulo: m.titulo || ""
      }));

      const response = await fetch(
        `http://localhost:5190/api/MarcadorVideo/video/${idVideo}/bulk`,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(marcadoresRequest),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al crear los marcadores: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      // Después de crear en lote, actualizar nuestra lista local obteniendo todos los marcadores
      await fetchMarcadoresByVideoId(idVideo);
      
      return marcadoresPorVideo.value;
    } catch (error: any) {
      let message = "Error al crear los marcadores en lote";

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
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Actualizar un marcador existente
  async function updateMarcador(idMarcador: number, marcador: MarcadorVideoDTO) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `http://localhost:5190/api/MarcadorVideo/${idMarcador}`,
        {
          method: "PUT",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(marcador),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al actualizar el marcador: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      // Actualizar el marcador en la lista local
      const index = marcadoresPorVideo.value.findIndex(m => m.idMarcador === idMarcador);
      if (index !== -1) {
        marcadoresPorVideo.value[index] = marcador;
      }
      
      // Ordenar por minuto importante
      marcadoresPorVideo.value.sort((a, b) => a.minutoImportante - b.minutoImportante);
      
      return marcador;
    } catch (error: any) {
      let message = "Error al actualizar el marcador";

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
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Eliminar un marcador por ID
  async function deleteMarcador(idMarcador: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `http://localhost:5190/api/MarcadorVideo/${idMarcador}`,
        {
          method: "DELETE",
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
          `Error al eliminar el marcador: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      // Actualizar el estado local eliminando el marcador
      marcadoresPorVideo.value = marcadoresPorVideo.value.filter(
        (m) => m.idMarcador !== idMarcador
      );

      return true;
    } catch (error: any) {
      let message = "Error al eliminar el marcador";

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
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Método para convertir un timestamp de UI a MarcadorVideoDTO
  function convertTimestampToMarcadorDTO(timestamp: any, idVideo: number): MarcadorVideoDTO {
    return {
      idVideo: idVideo,
      minutoImportante: timestamp.time || timestamp.tiempo || 0, // Convertir a decimal si es necesario
      titulo: timestamp.title || timestamp.titulo || ""
    };
  }

  return {
    marcadores,
    marcadoresPorVideo,
    marcador,
    loading,
    errorMessage,
    fetchMarcadoresByVideoId,
    createMarcador,
    createMarcadoresEnLote,
    updateMarcador,
    deleteMarcador,
    convertTimestampToMarcadorDTO
  };
});