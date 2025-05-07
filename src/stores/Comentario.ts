import { defineStore } from "pinia";
import { ref } from "vue";

export const useComentarioStore = defineStore("comentario", () => {
  // --------------------------- Estado ---------------------------
  const errorMessage = ref("");

  // --------------------------- Obtener comentarios por ID de archivo ---------------------------
  async function fetchComentariosByArchivoId(idArchivo: number) {
    try {
      const response = await fetch(`http://localhost:5190/api/Comentario/archivo/${idArchivo}`);
      if (!response.ok) return []; // Si no hay comentarios, retorna un array vacío
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return []; // En caso de error, retorna un array vacío
    }
  }

  // --------------------------- Crear comentario ---------------------------
  async function createComentario(nuevoComentario: {
    contenido: string;
    fechaCreacion: string;
    idUsuario: number;
    idArchivo: number;
  }) {
    try {
      const comentarioData = {
        idComentario: 0,  // El ID será asignado por el backend
        contenido: nuevoComentario.contenido,
        fechaCreacion: nuevoComentario.fechaCreacion,
        idUsuario: nuevoComentario.idUsuario,
        idArchivo: nuevoComentario.idArchivo
      };
      
      console.log("Enviando comentario:", JSON.stringify(comentarioData));

      const response = await fetch("http://localhost:5190/api/Comentario/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comentarioData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error del servidor (${response.status}): ${errorText}`);
        return null;
      }
      
      return await response.json(); // Retorna el comentario creado
    } catch (error) {
      console.error("Error en createComentario:", error);
      return null; // Si ocurre un error, retorna null
    }
  }

  return { 
    fetchComentariosByArchivoId, 
    createComentario 
  };
});
