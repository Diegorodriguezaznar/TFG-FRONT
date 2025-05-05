import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { TemarioDTO } from "@/stores/dtos/TemarioDTO";

export const useTemarioStore = defineStore("temario", () => {
  const temarios = ref<TemarioDTO[]>([]);
  const errorMessage = ref<string>("");

  //Find All Classic!
  async function fetchAllTemarios() {
    try {
      const response = await fetch("http://localhost:5687/api/Temario");
      if (!response.ok) throw new Error("Error al obtener todos los temarios");

      temarios.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener todos los temarios:", error);
    }
  }

  // filtro por ID
  async function fetchTemarioById(idTemario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Temario/${idTemario}`);
      if (!response.ok) throw new Error("Error al obtener el temario");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el temario:", error);
      return null;
    }
  }

  // filtro por id de ASIGNATURAS
  async function fetchTemariosByAsignatura(idAsignatura: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Temario/asignatura/${idAsignatura}`);
      if (!response.ok) throw new Error("Error al obtener los temarios de la asignatura");

      temarios.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener los temarios de la asignatura:", error);
    }
  }

  // filtro por nombre
  const temariosFiltrados = computed(() => (searchQuery: string) => {
    if (!searchQuery) return temarios.value;
    return temarios.value.filter(temario =>
      temario.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return { temarios, fetchAllTemarios, fetchTemarioById, fetchTemariosByAsignatura, temariosFiltrados, errorMessage };
});
