<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed } from 'vue';

// --------------------------- Fetch a la API ---------------------------
async function fetchCursos() {
  try {
    const response = await fetch("http://localhost:5687/api/Curso");
    if (!response.ok) throw new Error("Error al obtener los cursos");

    cursos.value = await response.json();

    emit("cursosCargados", cursos.value);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
  }
}

// --------------------------- Filtrar cursos ---------------------------
const cursosFiltrados = computed(() => {
  if (!props.searchQuery) return cursos.value;
  return cursos.value.filter(curso =>
    curso.nombre.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

// --------------------------- Propiedades ---------------------------
defineProps({
  searchQuery: String
});

// --------------------------- eventos ---------------------------
const emit = defineEmits(["cursosCargados"]);

// --------------------------- Almacenar cursos ---------------------------
const cursos = ref([]);

// --------------------------- Llamar al método al montar ---------------------------
onMounted(fetchCursos);
</script>

<template>
  <!-- --------------------------- Contenedor de cursos --------------------------- -->
  <v-container class="ListaCursos__Contenedor">
    <v-row align="start" justify="start">
      
      <!-- --------------------------- Mostrar cursos --------------------------- -->
      <v-col v-for="curso in cursosFiltrados" :key="curso.idCurso" cols="12" sm="6" md="4" lg="3">
        <CardCurso 
          :id="curso.idCurso"
          :titulo="curso.nombre"
          :descripcion="curso.descripcion"
          :imagen="curso.imagen"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  @import "@/assets/sass/components/Lists/Lcursos.scss";
</style>
