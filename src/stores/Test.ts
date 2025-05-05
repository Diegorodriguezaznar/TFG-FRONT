import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { TestDTO } from "@/stores/dtos/TestDTO";

export const useTestStore = defineStore("test", () => {
  const tests = ref<TestDTO[]>([]);
  const errorMessage = ref<string>("");

  // Obtener todos los tests
  async function fetchAllTests() {
    try {
      const response = await fetch("http://localhost:5687/api/Test");
      if (!response.ok) throw new Error("Error al obtener todos los tests");

      tests.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener todos los tests:", error);
    }
  }

  // Obtener test por ID
  async function fetchTestById(idTest: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Test/${idTest}`);
      if (!response.ok) throw new Error("Error al obtener el test");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el test:", error);
      return null;
    }
  }

  // Obtener tests por ID de temario
  async function fetchTestsByTemario(idTemario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Test/temario/${idTemario}`);
      if (!response.ok) throw new Error("Error al obtener los tests del temario");

      tests.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener los tests del temario:", error);
    }
  }

  // Filtrar tests por término de búsqueda
  const testsFiltrados = computed(() => (searchQuery: string) => {
    if (!searchQuery) return tests.value;
    return tests.value.filter(test =>
      test.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return { tests, fetchAllTests, fetchTestById, fetchTestsByTemario, testsFiltrados, errorMessage };
});