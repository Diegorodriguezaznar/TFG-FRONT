import { defineStore } from "pinia";
import { ref } from "vue";
import type { MarcadorVideoDTO } from "@/stores/dtos/MarcadorVideoDTO";

export const useMarcadorVideoStore = defineStore("marcadorVideo", () => {
  const marcadores = ref<MarcadorVideoDTO[]>([]);
  const marcadoresPorVideo = ref<MarcadorVideoDTO[]>([]);
  const marcador = ref<MarcadorVideoDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // GET - Obtener marcadores por ID de video
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

      marcadoresPorVideo.value.sort((a, b) => a.minutoImportante - b.minutoImportante);

      return marcadoresPorVideo.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al obtener los marcadores del video";
      marcadoresPorVideo.value = [];
      return marcadoresPorVideo.value;
    } finally {
      loading.value = false;
    }
  }

  // POST - Crear marcador
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
      
      marcadoresPorVideo.value.push(data);
      marcadoresPorVideo.value.sort((a, b) => a.minutoImportante - b.minutoImportante);
      
      return data;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al crear el marcador";
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // POST - Crear marcadores en lote
  async function createMarcadoresEnLote(idVideo: number, marcadores: MarcadorVideoDTO[]) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

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

      await fetchMarcadoresByVideoId(idVideo);
      
      return marcadoresPorVideo.value;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al crear los marcadores en lote";
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // PUT - Actualizar marcador
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

      const index = marcadoresPorVideo.value.findIndex(m => m.idMarcador === idMarcador);
      if (index !== -1) {
        marcadoresPorVideo.value[index] = marcador;
      }
      
      marcadoresPorVideo.value.sort((a, b) => a.minutoImportante - b.minutoImportante);
      
      return marcador;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al actualizar el marcador";
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // DELETE - Eliminar marcador
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

      marcadoresPorVideo.value = marcadoresPorVideo.value.filter(
        (m) => m.idMarcador !== idMarcador
      );

      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al eliminar el marcador";
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Convertir timestamp de UI a MarcadorVideoDTO
  function convertTimestampToMarcadorDTO(timestamp: any, idVideo: number): MarcadorVideoDTO {
    return {
      idVideo: idVideo,
      minutoImportante: timestamp.time || timestamp.tiempo || 0,
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