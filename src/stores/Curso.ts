import { defineStore } from "pinia";
import { ref } from "vue";
import type { CursoDTO } from "@/stores/dtos/CursoDTO";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

export const useCursoStore = defineStore("curso", () => {
  const cursos = ref<CursoDTO[]>([]);
  const curso = ref<CursoDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // GET - Obtener todos los cursos
  async function fetchAllCursos() {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch("http://localhost:5000/api/Curso", {
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
      errorMessage.value = error.message || "Error al obtener los cursos";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // GET - Obtener curso por ID
  async function fetchCursoById(idCurso: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 
      
      const response = await fetch(`http://localhost:5000/api/Curso/${idCurso}`, {
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
      errorMessage.value = error.message || "Error al obtener el curso";
      return null;
    } finally {
      loading.value = false;
    }
  }

  // POST - Crear curso
  async function createCurso(
    cursoData: Omit<CursoDTO, 'idCurso' | 'fechaCreacion' | 'idUsuario' | 'usuario'>,
    imagenFile?: File
  ) {
    loading.value = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const usuarioStore = useUsuarioLogeadoStore();

      const formData = new FormData();
      formData.append('Nombre', cursoData.nombre);
      formData.append('Descripcion', cursoData.descripcion || '');
      formData.append('IdUsuario', usuarioStore.usuarioActual?.idUsuario?.toString() || '');
      
      if (imagenFile) {
        formData.append('Imagen', imagenFile);
      }

      const response = await fetch("http://localhost:5000/api/Curso/crear", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${usuarioStore.token}`
        },
        body: formData,
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
      errorMessage.value = error.message || "Error al crear el curso";
      return null;
    } finally {
      loading.value = false;
    }
  }

  // PUT - Actualizar curso
  async function updateCurso(updatedCurso: CursoDTO) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5000/api/Curso/${updatedCurso.idCurso}`, {
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
      
      const index = cursos.value.findIndex(c => c.idCurso === updatedCurso.idCurso);
      if (index !== -1) {
        cursos.value[index] = updatedData;
      }
      
      return updatedData;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al actualizar el curso";
      return null;
    } finally {
      loading.value = false;
    }
  }

  // DELETE - Eliminar curso
  async function deleteCurso(idCurso: number) {
    loading.value = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`http://localhost:5000/api/Curso/${idCurso}`, {
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

      cursos.value = cursos.value.filter(c => c.idCurso !== idCurso);
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al eliminar el curso";
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