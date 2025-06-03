import { defineStore } from "pinia";
import { ref } from "vue";
import type { ComentarioDTO, ComentarioUI } from "@/stores/dtos/ComentarioDTO";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

export const useComentarioStore = defineStore("comentario", () => {
  const errorMessage = ref("");
  const loading = ref(false);
  const usuarioLogeadoStore = useUsuarioLogeadoStore();

  // Método GET obtener comentarios por ID de video
  async function fetchComentariosByVideoId(idVideo: number): Promise<ComentarioUI[]> {
    loading.value = true;
    errorMessage.value = "";
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://34.198.50.70:5000/api/ComentarioVideo/video/${idVideo}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        const errorText = await response.text();
        throw new Error(`Error al obtener comentarios: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const comentarios = await response.json();
      return comentarios.map((c: any) => transformarComentario(c));
    } catch (error: any) {
      let message = "Error al obtener los comentarios";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Método GET obtener comentarios reportados
  async function fetchComentariosReportados(): Promise<ComentarioUI[]> {
    loading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(`http://34.198.50.70:5000/api/ComentarioVideo/reportados`, {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener comentarios reportados: ${response.statusText}`);
      }

      const comentarios = await response.json();
      return comentarios.map((c: any) => transformarComentario(c));
    } catch (error: any) {
      errorMessage.value = error.message || "Error al cargar comentarios reportados";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Método POST crear comentario
  async function createComentario(nuevoComentario: {
    contenido: string;
    idUsuario: number;
    idVideo: number;
  }): Promise<ComentarioUI | null> {
    loading.value = true;
    errorMessage.value = "";
    
    try {
      const comentarioData = {
        idComentario: 0,
        texto: nuevoComentario.contenido,
        fecha: new Date().toISOString(),
        idUsuario: nuevoComentario.idUsuario,
        idVideo: nuevoComentario.idVideo
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch("http://34.198.50.70:5000/api/ComentarioVideo", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(comentarioData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear comentario: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const comentarioCreado = await response.json();
      return transformarComentario(comentarioCreado);
    } catch (error: any) {
      let message = "Error al crear el comentario";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Método PUT reportar comentario
  async function reportarComentario(idComentario: number): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(`http://34.198.50.70:5000/api/ComentarioVideo/reportar/${idComentario}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Error al reportar comentario: ${response.statusText}`);
      }

      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al reportar comentario";
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Método PUT quitar reportes de comentario
  async function quitarReporteComentario(idComentario: number): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(`http://34.198.50.70:5000/api/ComentarioVideo/quitar-reportes/${idComentario}`, {
        method: "PUT",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error al quitar los reportes del comentario.");
      }

      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error quitando reporte";
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Método DELETE eliminar comentario
  async function eliminarComentario(idComentario: number): Promise<void> {
    loading.value = true;
    errorMessage.value = "";

    try {
      const response = await fetch(`http://34.198.50.70:5000/api/ComentarioVideo/${idComentario}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar comentario: ${errorText}`);
      }
    } catch (error: any) {
      errorMessage.value = error.message || "Error al eliminar comentario";
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // Método DELETE eliminar comentario propio
  async function eliminarComentarioPropio(idComentario: number): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no disponible");

      const response = await fetch(`http://34.198.50.70:5000/api/ComentarioVideo/borrar-propio/${idComentario}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar comentario propio: ${response.status} ${errorText}`);
      }

      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al eliminar comentario propio";
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Método utilitario transformar comentario del API a formato UI
  function transformarComentario(c: any): ComentarioUI {
    const fecha = new Date(c.fecha);
    const ahora = new Date();
    
    let tiempoTexto = '';
    const diferenciaMs = ahora.getTime() - fecha.getTime();
    const segundos = Math.floor(diferenciaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) {
      tiempoTexto = dias === 1 ? 'hace 1 día' : `hace ${dias} días`;
    } else if (horas > 0) {
      tiempoTexto = horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`;
    } else if (minutos > 0) {
      tiempoTexto = minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`;
    } else {
      tiempoTexto = 'ahora mismo';
    }
    
    const nombreCompleto = c.usuario?.apellidos 
      ? `${c.usuario.nombre} ${c.usuario.apellidos}` 
      : c.usuario?.nombre || 'Usuario';
    
    return {
      id: c.idComentario,
      user: nombreCompleto,
      avatar: `https://picsum.photos/seed/user${c.idUsuario}/40/40`,
      content: c.texto,
      likes: 0,
      time: tiempoTexto,
      idUsuario: c.idUsuario,
      fechaCreacion: c.fecha,
      numeroReportes: c.numeroReportes ?? 0 
    };
  }

  return { 
    fetchComentariosByVideoId, 
    createComentario,
    reportarComentario,
    fetchComentariosReportados,
    eliminarComentario,
    eliminarComentarioPropio,
    quitarReporteComentario,
    errorMessage,
    loading
  };
});