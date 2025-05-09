import { defineStore } from "pinia";
import { ref } from "vue";
import type { ComentarioVideoDTO } from "@/stores/dtos/ComentarioVideoDTO";

export const useComentarioVideoStore = defineStore("comentarioVideo", () => {
  // --------------------------- Estado ---------------------------
  const errorMessage = ref("");
  const loading = ref(false);

  // --------------------------- Obtener comentarios por ID de video ---------------------------
  async function fetchComentariosByVideoId(idVideo: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/ComentarioVideo/video/${idVideo}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Si no hay comentarios, retorna un array vacío
          return [];
        }
        const errorText = await response.text();
        throw new Error(`Error al obtener comentarios: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const comentarios = await response.json();
      
      // Transformar fechas y formatear datos para la interfaz de usuario
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
      console.error(message, error);
      
      // Fallback con datos de ejemplo en caso de error
      return simularComentarios();
    } finally {
      loading.value = false;
    }
  }

  // --------------------------- Crear comentario ---------------------------
  async function createComentario(nuevoComentario: {
    contenido: string;
    idUsuario: number;
    idVideo: number;
  }) {
    loading.value = true;
    try {
      const comentarioData = {
        idComentarioVideo: 0,  // El ID será asignado por el backend
        contenido: nuevoComentario.contenido,
        fechaCreacion: new Date().toISOString(),
        idUsuario: nuevoComentario.idUsuario,
        idVideo: nuevoComentario.idVideo
      };
      
      console.log("Enviando comentario:", JSON.stringify(comentarioData));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch("http://localhost:5190/api/ComentarioVideo", {
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
      
      // Transformar para la interfaz de usuario
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
      console.error(message, error);
      
      // Fallback, simulamos que se creó
      return simularComentarioCreado(nuevoComentario.contenido, nuevoComentario.idUsuario);
    } finally {
      loading.value = false;
    }
  }

  // --------------------------- Funciones auxiliares ---------------------------
  
  // Transformar comentario del API a formato amigable para UI
  function transformarComentario(c: any) {
    // Formatear la fecha
    const fecha = new Date(c.fechaCreacion);
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
    
    return {
      id: c.idComentarioVideo,
      user: c.usuario?.nombre || 'Usuario',
      avatar: `https://picsum.photos/seed/user${c.idUsuario}/40/40`,
      content: c.contenido,
      likes: Math.floor(Math.random() * 100),  // Simulado
      time: tiempoTexto,
      idUsuario: c.idUsuario,
      fechaCreacion: c.fechaCreacion
    };
  }
  
  // Simular comentarios para desarrollo
  function simularComentarios() {
    return [
      {
        id: 1,
        user: 'Laura García',
        avatar: 'https://picsum.photos/seed/user1/40/40',
        content: 'Excelente video, me ha sido muy útil para entender este tema.',
        likes: 24,
        time: 'hace 2 días',
        idUsuario: 1,
        fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        user: 'Carlos Mendoza',
        avatar: 'https://picsum.photos/seed/user2/40/40',
        content: 'Me encantaría ver más contenido como este. ¡Gracias por compartir!',
        likes: 18,
        time: 'hace 1 día',
        idUsuario: 2,
        fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        user: 'Ana Torres',
        avatar: 'https://picsum.photos/seed/user3/40/40',
        content: '¿Alguien sabe dónde puedo encontrar más información sobre este tema?',
        likes: 7,
        time: 'hace 12 horas',
        idUsuario: 3,
        fechaCreacion: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
  
  // Simular creación de comentario
  function simularComentarioCreado(contenido: string, idUsuario: number) {
    return {
      id: Date.now(),  // ID único basado en timestamp
      user: 'Usuario actual',
      avatar: `https://picsum.photos/seed/userCurrent/40/40`,
      content: contenido,
      likes: 0,
      time: 'ahora mismo',
      idUsuario,
      fechaCreacion: new Date().toISOString()
    };
  }

  return { 
    fetchComentariosByVideoId, 
    createComentario,
    errorMessage,
    loading
  };
});