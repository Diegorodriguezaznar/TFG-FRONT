import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AsignaturaDTO } from "@/stores/dtos/AsignaturasDTO";
import type { AsignaturaCrearDTO } from "@/stores/dtos/AsignaturaCrearDTO";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

export const useAsignaturaStore = defineStore("asignatura", () => {
  const asignaturas = ref<AsignaturaDTO[]>([]);
  const errorMessage = ref<string>("");
  const isLoading = ref<boolean>(false);
  const successMessage = ref<string>("");

  // Método para limpiar mensajes
  function clearMessages() {
    errorMessage.value = "";
    successMessage.value = "";
  }

  // Método GET obtener todas las asignaturas
  async function fetchAllAsignaturas() {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch("http://localhost:5190/api/Asignatura");
      if (!response.ok) throw new Error("Error al obtener todas las asignaturas");
      asignaturas.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Método GET obtener asignaturas por curso
  async function fetchAsignaturasByCurso(idCurso: number) {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/curso/${idCurso}`);
      if (!response.ok) throw new Error("Error al obtener las asignaturas del curso");
      asignaturas.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
  }

  // Método GET obtener asignatura por ID
  async function fetchAsignaturaById(idAsignatura: number): Promise<AsignaturaDTO | null> {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/${idAsignatura}`);
      if (!response.ok) throw new Error("Error al obtener la asignatura");
      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Método POST crear asignatura
  async function createAsignatura(nuevaAsignatura: AsignaturaCrearDTO): Promise<boolean> {
    isLoading.value = true;
    clearMessages();

    try {
      const { token } = useUsuarioLogeadoStore();

      const response = await fetch("http://localhost:5190/api/Asignatura", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevaAsignatura.nombre,
          descripcion: nuevaAsignatura.descripcion,
          idCurso: nuevaAsignatura.idCurso
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear la asignatura: ${response.status} ${errorText}`);
      }

      const asignaturaCreada = await response.json();
      asignaturas.value.push(asignaturaCreada);
      successMessage.value = "Asignatura creada con éxito";
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Método PUT actualizar asignatura
  async function updateAsignatura(asignatura: AsignaturaDTO): Promise<boolean> {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/${asignatura.idAsignatura}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asignatura),
      });

      if (!response.ok) throw new Error("Error al actualizar la asignatura");

      const index = asignaturas.value.findIndex(a => a.idAsignatura === asignatura.idAsignatura);
      if (index !== -1) {
        asignaturas.value[index] = asignatura;
      }
      
      successMessage.value = "Asignatura actualizada con éxito";
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Método DELETE eliminar asignatura
  async function deleteAsignatura(idAsignatura: number): Promise<boolean> {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/${idAsignatura}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la asignatura");

      asignaturas.value = asignaturas.value.filter(a => a.idAsignatura !== idAsignatura);
      successMessage.value = "Asignatura eliminada con éxito";
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Computed filtrar asignaturas por búsqueda
  const asignaturasFiltradas = computed(() => (searchQuery: string) => {
    if (!searchQuery) return asignaturas.value;
    return asignaturas.value.filter(asignatura =>
      asignatura.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return { 
    asignaturas, 
    isLoading,
    errorMessage,
    successMessage,
    fetchAllAsignaturas, 
    fetchAsignaturasByCurso, 
    fetchAsignaturaById,
    createAsignatura,
    updateAsignatura,
    deleteAsignatura,
    asignaturasFiltradas,
    clearMessages
  };
});