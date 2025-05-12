import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AsignaturaDTO } from "@/stores/dtos/AsignaturasDTO";

export const useAsignaturaStore = defineStore("asignatura", () => {
  // --------------------------- Estado ---------------------------
  const asignaturas = ref<AsignaturaDTO[]>([]);
  const errorMessage = ref<string>("");
  const isLoading = ref<boolean>(false);
  const successMessage = ref<string>("");

  // --------------------------- Métodos de gestión de mensajes ---------------------------
  // Limpiar mensajes
  function clearMessages() {
    errorMessage.value = "";
    successMessage.value = "";
  }

  // --------------------------- Métodos de Fetch ---------------------------
  // Obtener todas las asignaturas
  async function fetchAllAsignaturas() {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch("http://localhost:5190/api/Asignatura");
      if (!response.ok) throw new Error("Error al obtener todas las asignaturas");

      asignaturas.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener todas las asignaturas:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Obtener asignaturas por curso
  async function fetchAsignaturasByCurso(idCurso: number) {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/curso/${idCurso}`);
      if (!response.ok) throw new Error("Error al obtener las asignaturas del curso");

      asignaturas.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener asignaturas del curso:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Obtener una asignatura por ID
  async function fetchAsignaturaById(idAsignatura: number): Promise<AsignaturaDTO | null> {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/${idAsignatura}`);
      if (!response.ok) throw new Error("Error al obtener la asignatura");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener la asignatura:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // --------------------------- Métodos de modificación de asignaturas ---------------------------
  // Crear una nueva asignatura
  async function createAsignatura(nuevaAsignatura: Omit<AsignaturaDTO, 'idAsignatura' | 'fechaCreacion'>): Promise<boolean> {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch("http://localhost:5190/api/Asignatura", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaAsignatura),
      });

      if (!response.ok) throw new Error("Error al crear la asignatura");

      const asignaturaCreada = await response.json();
      asignaturas.value.push(asignaturaCreada);
      successMessage.value = "Asignatura creada con éxito";
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear la asignatura:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Actualizar una asignatura existente
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

      // Actualizar la asignatura en el array local
      const index = asignaturas.value.findIndex(a => a.idAsignatura === asignatura.idAsignatura);
      if (index !== -1) {
        asignaturas.value[index] = asignatura;
      }
      
      successMessage.value = "Asignatura actualizada con éxito";
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al actualizar la asignatura:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Eliminar una asignatura
  async function deleteAsignatura(idAsignatura: number): Promise<boolean> {
    isLoading.value = true;
    clearMessages();
    
    try {
      const response = await fetch(`http://localhost:5190/api/Asignatura/${idAsignatura}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la asignatura");

      // Eliminar la asignatura del array local
      asignaturas.value = asignaturas.value.filter(a => a.idAsignatura !== idAsignatura);
      
      successMessage.value = "Asignatura eliminada con éxito";
      return true;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al eliminar la asignatura:", error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // --------------------------- Filtrado de asignaturas ---------------------------
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