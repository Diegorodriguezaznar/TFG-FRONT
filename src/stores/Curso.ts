import { defineStore } from "pinia";
import { ref } from "vue";
import type { CursoDTO } from "@/stores/dtos/CursoDTO";
 import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";


export const useCursoStore = defineStore("curso", () => {
  // --------------------------- Estado ---------------------------
  const cursos = ref<CursoDTO[]>([]);
  const curso = ref<CursoDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos de Fetch ---------------------------
  
  // Obtener todos los cursos
  async function fetchAllCursos() {
    loading.value = true;
    try {
      // Agregar un timeout para evitar que la promesa se quede pendiente indefinidamente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
      
      const response = await fetch("http://localhost:5190/api/Curso", {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener los cursos: ${response.status} ${response.statusText}. ${errorText}`);
      }

      cursos.value = await response.json();
      return cursos.value;
    } catch (error: any) {
      let message = "Error al obtener los cursos";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Obtener un curso por ID
  async function fetchCursoById(idCurso: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      
      const response = await fetch(`http://localhost:5190/api/Curso/${idCurso}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener el curso: ${response.status} ${response.statusText}. ${errorText}`);
      }

      curso.value = await response.json();
      return curso.value;
    } catch (error: any) {
      let message = "Error al obtener el curso";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // --------------------------- Métodos de Modificación ---------------------------
  
  // Crear un nuevo curso
  async function createCurso(
    cursoData: Omit<CursoDTO, 'idCurso' | 'fechaCreacion' | 'idUsuario' | 'usuario'>,
    imagenFile?: File
  ) {
    loading.value = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const usuarioStore = useUsuarioLogeadoStore();

      // Crear FormData para enviar archivo
      const formData = new FormData();
      formData.append('Nombre', cursoData.nombre);
      formData.append('Descripcion', cursoData.descripcion || '');
      formData.append('IdUsuario', usuarioStore.usuarioActual?.idUsuario?.toString() || '');
      
      // Agregar imagen si existe
      if (imagenFile) {
        formData.append('Imagen', imagenFile);
      }

      const response = await fetch("http://localhost:5190/api/Curso/crear", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${usuarioStore.token}`
          // NO incluir Content-Type para FormData
        },
        body: formData, // FormData en lugar de JSON
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear el curso: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const createdCurso = await response.json();
      cursos.value.push(createdCurso);
      return createdCurso;
    } catch (error: any) {
      // ... mismo manejo de errores
      let message = "Error al crear el curso";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }

      errorMessage.value = message;
      console.error(message, error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Actualizar un curso existente
  async function updateCurso(updatedCurso: CursoDTO) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/Curso/${updatedCurso.idCurso}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updatedCurso),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el curso: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const updatedData = await response.json();
      curso.value = updatedData;
      
      // Actualizar el curso en la lista
      const index = cursos.value.findIndex(c => c.idCurso === updatedCurso.idCurso);
      if (index !== -1) {
        cursos.value[index] = updatedData;
      }
      
      return updatedData;
    } catch (error: any) {
      let message = "Error al actualizar el curso";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
      } else {
        message = error.message || message;
      }
      
      errorMessage.value = message;
      console.error(message, error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Eliminar un curso
  async function deleteCurso(idCurso: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5190/api/Curso/${idCurso}`, {
        method: "DELETE",
        headers: { 
          "Accept": "application/json"
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar el curso: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // Actualizar la lista de cursos en el frontend después de eliminar
      cursos.value = cursos.value.filter(c => c.idCurso !== idCurso);
      return true;
    } catch (error: any) {
      let message = "Error al eliminar el curso";
      
      if (error.name === 'AbortError') {
        message = "La conexión con el servidor ha excedido el tiempo de espera";
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        message = "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";
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

  return { 
    cursos, 
    curso, 
    loading,
    fetchAllCursos, 
    fetchCursoById, 
    createCurso, 
    updateCurso, 
    deleteCurso, 
    errorMessage 
  };
});