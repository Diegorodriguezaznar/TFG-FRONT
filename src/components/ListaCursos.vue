<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import { useCursoStore } from '@/stores/Curso'; 
import CardCurso from '@/components/CardCurso.vue';

// --------------------------- Store ---------------------------
const cursoStore = useCursoStore();

// --------------------------- Props ---------------------------
const props = defineProps({
  searchQuery: String
});

// --------------------------- Eventos ---------------------------
const emit = defineEmits(["cursosCargados"]);

// --------------------------- Filtrar cursos ---------------------------
const cursosFiltrados = computed(() => {
  if (!props.searchQuery) return cursoStore.cursos;
  
  return cursoStore.cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    (curso.descripcion && curso.descripcion.toLowerCase().includes(props.searchQuery.toLowerCase()))
  );
});

// --------------------------- Cargar cursos ---------------------------
onMounted(async () => {
  try {
    await cursoStore.fetchAllCursos();
    emit("cursosCargados", cursoStore.cursos);
  } catch (error) {
    console.error("Error al cargar cursos:", error);
    // El error ya se maneja en el store
  }
});
</script>

<template>
  <!-- Skeleton loaders mientras carga -->
  <v-container v-if="cursoStore.loading" class="ListaCursos__Contenedor">
    <v-row align="start" justify="start">
      <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader
          type="card"
          height="300"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
  
  <!-- Estado vacío -->
  <v-container v-else-if="cursosFiltrados.length === 0" class="ListaCursos__Contenedor">
    <v-row>
      <v-col cols="12" class="text-center py-8">
        <v-icon size="x-large" color="grey-lighten-2" class="mb-4">mdi-book-off</v-icon>
        <div class="text-h5 text-grey-darken-1">No se encontraron cursos</div>
        <div v-if="searchQuery" class="text-body-1 text-grey">
          Prueba con otro término de búsqueda
        </div>
        <div v-else class="text-body-1 text-grey">
          Vuelve pronto para ver nuestros nuevos cursos
        </div>
      </v-col>
    </v-row>
  </v-container>
  
  <!-- Contenedor de cursos -->
  <v-container v-else class="ListaCursos__Contenedor">
    <v-row align="start" justify="start">
      <!-- Mostrar cursos -->
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
.ListaCursos__Contenedor {
  width: 100%;
}
</style>